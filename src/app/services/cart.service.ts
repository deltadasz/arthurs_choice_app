import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { CartModel } from '../models/cartModel';
import { Storage } from '@ionic/storage';
import {NavigationExtras, Router} from '@angular/router';

import { ProductModel } from '../models/product-model';
import {OrderModel} from '../models/orderModel';
import {WriteObject} from './backend.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CartService {
// Local Variables

private serverUrl = environment.backend_api_url;
private cartDataArray: CartModel = {
  count: 0,
  productData: []
};

private cartData$ = new BehaviorSubject<CartModel>({count: 0, productData: []});
private totalAmount = 0;
private totalAmount$ = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private toastController: ToastController,
              private storage: Storage,
              private router: Router) {

                this.totalAmount = 0;
                this.storage.get('cart').then(data => {
                  if (data) {
                    this.cartDataArray = data ;
                    this.cartData$.next(this.cartDataArray);
                    this.calculatTotal();

                  }
                });
              }


            async addToCart(product: ProductModel) {
              const loader = await this.loadingController.create({
                message: 'Adding To Cart...',
                animated: true,
                spinner: 'circles',
                backdropDismiss: false,
                showBackdrop: true
              });

              const alert = await this.alertController.create({
                header: 'Cart Updated',
                buttons: [
                  {
                    text: 'Continue',
                    role: 'cancel',
                    cssClass: 'continue',
                    handler: () => {
                      console.log('Product Added');
                    }
                  },
                  {
                  text: 'View Cart',
                  cssClass: 'view-cart',
                  handler: () => {
                    this.router.navigateByUrl('/tabs/tab3').then();
                  }
                  }
                ],
                animated: true,
                message: 'Product added to cart',
                backdropDismiss: false,
                cssClass: 'add-product'
              });

              const toast = await this.toastController.create ({
                message: 'Only 5 allowed in cart',
                header: 'Maxim Quantity Reached',
                duration: 2000,
                position: 'bottom',
                animated: true,
                color: 'warning',
                buttons: [
                  {
                    side: 'end',
                    role: 'cancel',
                    text: 'Ok'
                  }
                ]

              });
              await loader.present().then();

              // When the cart is completely empty

              if (this.cartDataArray.count !== 0) {
                const index = this.cartDataArray.productData.findIndex(p => p.id === product.id);

                if (index > -1) {
                  if (this.cartDataArray.productData[index].in_cart >= 5) {
                    this.cartDataArray.productData[index].in_cart = 5;
                    this.calculatTotal();
                    this.storage.set('cart', {...this.cartDataArray}).then();
                    await loader.dismiss().then();
                    await toast.present().then();
                  } else {
                    this.cartDataArray.productData[index].in_cart += 1;
                    this.calculatTotal();
                    this.storage.set('cart', {...this.cartDataArray}).then();
                    await loader.dismiss().then();
                    await alert.present().then();

                  }
                  this.cartData$.next(this.cartDataArray);
                }

              else {
                this.cartDataArray.productData.push(product);
                const newPorductIndex = this.cartDataArray.productData.findIndex(p => p.id === product.id);
                this.cartDataArray.productData[newPorductIndex].in_cart = 1 ;
                this.calculatTotal();
                this.storage.set('cart', {...this.cartDataArray}).then();
                await loader.dismiss().then();
                await alert.present().then();
                this.cartDataArray.count = this.cartDataArray.productData.length;
                this.storage.set('cart', {...this.cartDataArray}).then();
                this.cartData$.next(this.cartDataArray);

              }

              }
               else {
                 this.cartDataArray.productData.push({...product, in_cart: 1});
                 this.cartDataArray.count = this.cartDataArray.productData.length;
                 this.calculatTotal();
                 this.storage.set('cart', {...this.cartDataArray}).then();
                 await loader.dismiss().then();
                 await alert.present().then();
                 this.cartData$.next(this.cartDataArray);

              }
            }

        removeFromCart(product: ProductModel) {
          this.cartDataArray.productData = this.cartDataArray.productData.filter(p => p.id !== product.id);
          this.cartDataArray.count = this.cartDataArray.productData.length;


          this.cartData$.next(this.cartDataArray);
          this.totalAmount$.next(this.totalAmount);
          this.storage.set('cart', {...this.cartDataArray}).then();
          return this.cartDataArray.productData;
        }
        private calculatTotal() {
          this.totalAmount = 0;
          if (this.cartDataArray.productData.length === 0) {
            this.totalAmount = 0;
            this.totalAmount$.next(this.totalAmount);
            return;
          }
          this.cartDataArray.productData.forEach(p => {
            this.totalAmount += parseInt(p.price, 10) * p.in_cart;
          });

          this.totalAmount$.next(this.totalAmount);
        }

        updateQuantity(indexOfProduct: number, newInCartValue: number) {
          this.cartDataArray.productData[indexOfProduct].in_cart = newInCartValue;
          this.calculatTotal();
          this.storage.set('cart', {...this.cartDataArray}).then();
          this.cartData$.next(this.cartDataArray);
          this.totalAmount$.next(this.totalAmount);
        }

        private emptyCart() {
          this.cartDataArray = {
            count: 0,
            productData: []
          };
          this.calculatTotal();
          this.cartData$.next(this.cartDataArray);
        }
        get cartData(): Observable<CartModel> {
          return this.cartData$.asObservable();
        }

        get cartTotal(): Observable<number> {
          return this.totalAmount$.asObservable();
        }

        getAllPaymentGateways() {
          return this.httpClient.get(`${this.serverUrl}/payment_gateways`);
        }

        getTaxes() {
          return this.httpClient.get(`${this.serverUrl}/taxes`);
        }

        async createOrder(orderData: OrderModel) {
          let headers = new HttpHeaders().set(WriteObject, '' );
          headers = headers.set('Content-Type', 'application/json');
          const loader = await this.loadingController.create({
            message: 'Placing order...',
            animated: true,
            spinner: 'circular'
          });
          await loader.present().then();

          this.httpClient.post(`${this.serverUrl}/orders`,  {...orderData}, {headers})
            .subscribe(async (newOrderDetails: any) => {
              await loader.dismiss().then();


              const navigationExtras: NavigationExtras = {
                state: {
                  message: 'Order Placed',
                  products: this.cartDataArray.productData,
                  orderId: newOrderDetails.id,
                  total: parseFloat(newOrderDetails.total)
                }
              };
              this.emptyCart();
              this.router.navigate(['/thankyou'], navigationExtras).then();
            });

        }

}




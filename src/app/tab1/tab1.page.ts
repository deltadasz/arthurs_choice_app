import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { SortModalComponent } from '../Components/sort-modal/sort-modal.component';
import { CategoryModel } from '../models/categoryModel';
import { ProductModel } from '../models/product-model';
import { ProductService } from '../services/product.service';
import {CartService} from '../services/cart.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  slideImages = [];

 listArrayOfProducts: ProductModel[] = [];
 displayedList: ProductModel[] = [];
 currentPage = 1;
 filterCount = 0;
 filterCategoryList: any[] = [];
 categories: CategoryModel [] = [];
 count: number;

  constructor(private productService: ProductService,
              private loadingController: LoadingController,
              private menuController: MenuController,
              private toastController: ToastController,
              private modalController: ModalController,
              private cartService: CartService) {
    this.loadMoreData(null).then();

  }

  async ngOnInit() {
    const loader = await this.loadingController.create({
      message: 'Getting Products..',
      spinner: 'bubbles',
      animated: true

    });
    await loader.present().then();
    this.productService.getAllProducts().subscribe(async (products: ProductModel[]) => {
      await loader.dismiss().then();
      this.listArrayOfProducts = products;
      this.displayedList = [...this.listArrayOfProducts];
    }, async (err) => {
      await loader.dismiss().then();
      console.log(err);
    });
    this.categories = await this.productService.getAllCategories().toPromise();
    this.cartService.cartData.pipe(
      map(data => data.count)
    ).subscribe(count => this.count = count);
  }

  async loadMoreData(ev: any) {
    const toast = await this.toastController.create ({
      message: 'No more products',
      animated: true,
      duration: 2000,
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    if (ev == null) {
      this.currentPage = 1;

      return;
    } else {
      this.currentPage++;
      this.productService.getAllProducts(this.currentPage).subscribe(async (prods: ProductModel[]) => {
        this.listArrayOfProducts = this.listArrayOfProducts.concat(prods);
        this.displayedList = [...this.listArrayOfProducts];

        if (ev !== null) {
          ev.target.complete();
        }
        if (prods.length < 10) {
          await toast.present().then();
          ev.target.disabled = true;
        }

      }, (err) => {
        console.log(err);
      });
    }
  }

  loadingSpinner(){
    this.loadingController.create({
      message: 'Loading Details..',
      animated: true,
      spinner: 'crescent',
      backdropDismiss: false,
      showBackdrop: true
    }).then(el => el.present());
  }

  openModal() {
    this.modalController.create({
      component: SortModalComponent,
      animated: true,
      cssClass: 'sortModal'
    }).then(el => {
       el.present();
       return el.onDidDismiss().then(resultData => {
         this.sort({role: resultData.role, data: resultData.data});

       });
    });

  }

  sort(resultData: {role: string, data: any}) {
    const {role, data} = {...resultData};

    // tslint:disable-next-line:triple-equals
    if (role == 'cancel') {
      return;
    }

    // tslint:disable-next-line:triple-equals
    else if (role == 'sort') {

      // Chenck the type of sorting asked by the customer

      if (data === 'title-asc') {
        this.displayedList.sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();

          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;

        });
      }

      else if (data === 'title-desc') {
        this.displayedList.sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();
          if (x > y) {
            return -1;
          }
          if (x < y) {
            return 1;
          }
          return 0;
        });
      }
      // tslint:disable-next-line:triple-equals
      else if (data == 'price-asc') {
        this.displayedList.sort((a, b) => {
          // @ts-ignore
          return a.price - b.price;
        });
      }

      else if (data === 'price-desc') {
        this.displayedList.sort((a, b ) => {
          // @ts-ignore
          return b.price - a.price;
        });
    }
  }
}

openFilter() {
  this.menuController.enable(true, 'filter');
  this.menuController.open('filter').then();

}

categoryFilter(ev: {name: string, selected: boolean}) {

  // If the user clicked the filter for the first time and nothing is selected


  if (ev.selected && this.filterCount === 0) {
    this.filterCategoryList.push(ev.name);
    this.filterCount++;
    // tslint:disable-next-line:triple-equals
    this.displayedList = this.displayedList.filter(p => p.categories.some(cat => cat.name == ev.name));
  }

  // If the category selected is not present in the list of items

  else if (ev.selected && this.filterCount >= 1) {
    const newArray = [...this.listArrayOfProducts];
    this.filterCount++;
    if (!this.filterCategoryList.includes(ev.name)) {
      this.filterCategoryList.push(ev.name);

      const product: ProductModel[] = newArray.filter(p => p.categories.some(cat => cat.name === ev.name));
      let i;

      product.forEach(p => {
        // tslint:disable-next-line:triple-equals
      i = this.displayedList.findIndex(prod => prod.id == p.id);

      // If product is present is the array
      if (i !== -1) {
        return;
      } else {
        this.displayedList = this.displayedList.concat(p);
      }


    });

  } else {
    return;
  }

}// End of else if
    else if (!ev.selected && this.filterCount >= 1) {
      const newArray = [...this.listArrayOfProducts];
      this.filterCount--;

      // Remove the category from the filter list array

      this.filterCategoryList = this.filterCategoryList.filter(el => el !== ev.name);

      if (this.filterCategoryList.length > 0) {
        this.displayedList = [];
        this.filterCategoryList.forEach(el => {
          this.displayedList = this.displayedList.concat(
            newArray.filter(p => p.categories.some(cat => cat.name === el))
          );
        });
      }
      // Check if the filter count has reached 0, that means no filter is present now

      if (this.filterCount === 0) {
        this.displayedList = [...this.listArrayOfProducts];
      }

    }
}

  segmentChange(ev: any) {
    const value = ev.target.value;
    if (value === 'featured') {
      this.loadMoreData(null).then();
      this.displayedList = this.listArrayOfProducts.filter(p => p.featured === true);
    } else {
      this.displayedList = [...this.listArrayOfProducts];
    }

  }
}




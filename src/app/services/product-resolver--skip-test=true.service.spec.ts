import { TestBed } from '@angular/core/testing';

import { ProductResolverSkipTest=trueService } from './product-resolver--skip-test=true.service';

describe('ProductResolverSkipTest=trueService', () => {
  let service: ProductResolverSkipTest=trueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductResolverSkipTest=trueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

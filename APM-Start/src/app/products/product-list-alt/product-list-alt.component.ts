import { Component, OnInit, OnDestroy } from '@angular/core';

import {catchError, EMPTY, Subscription} from 'rxjs';

import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;

  products$=this.productService.products$.pipe(catchError((err:string)=>{
    this.errorMessage=err;
    return EMPTY;
  }))

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}

import { Component } from '@angular/core';
import { Supplier } from '../../suppliers/supplier';
import { Product } from '../model/product';

import { ProductService } from '../service/product.service';
import {catchError, EMPTY, Subject} from "rxjs";

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  private errorSubject=new Subject<string>();
  errorObservable$=this.errorSubject.asObservable();
  productSuppliers: Supplier[] | null = null;
  selectedProduct$ = this.productService.selectedProduct$.pipe(catchError(((err:string)=>{
    this.errorSubject.next(err);
    return EMPTY;
  })))
  constructor(private productService: ProductService) { }

}

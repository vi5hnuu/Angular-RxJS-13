import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, startWith, Subject, tap} from 'rxjs';
import {ProductCategory} from '../../product-categories/product-category';

import {Product} from '../model/product';
import {ProductService} from '../service/product.service';
import {ProductCategoryService} from "../../product-categories/product-category.service";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorySelectedAction = new BehaviorSubject<number>(0)
  categorySelectedAction$ = this.categorySelectedAction.asObservable();

  categories$ = this.productCategoryService.productCategories$.pipe(catchError((err: string) => {
    this.errorMessage = err;
    return EMPTY;
  }));

  // productsWithCategory$: Observable<Product[]> = combineLatest([this.productService.productsWithCategory$, this.categorySelectedAction$]).pipe(map(([productsWithCategory, categoryId]) => {
  //   return productsWithCategory.filter((product: Product) => categoryId ? product.categoryId === categoryId : true);
  // }), catchError((err: string) => {
  //   this.errorMessage = err;
  //   return EMPTY;
  //   // return of([])
  // }));

  productsWithCategory$: Observable<Product[]> = combineLatest([this.productService.productsWithAdd$, this.categorySelectedAction$]).pipe(tap(console.log),map(([pWCategory, cId]) => {
    return pWCategory.filter((product: Product) => cId ? product.categoryId === cId : true);
  }), catchError((err: string) => {
    this.errorMessage = err;
    return EMPTY;
    // return of([])
  }));

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) {
  }

  ngOnDestroy(): void {
  }

  onAdd(): void {
    this.productService.addProduct({
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    } as Product);
  }

  onSelected(categoryId: string): void {
    this.categorySelectedAction.next(+categoryId);
  }
}

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable, startWith, Subject} from 'rxjs';
import {ProductCategory} from '../../product-categories/product-category';

import {Product} from '../model/product';
import {ProductService} from '../service/product.service';
import {ProductCategoryService} from "../../product-categories/product-category.service";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorySelectedAction=new Subject<number>()
  categorySelectedAction$=this.categorySelectedAction.asObservable();

  categories$= this.productCategoryService.productCategories$.pipe(catchError((err:string)=>{
    this.errorMessage = err;
    return EMPTY;
  }));

  productsWithCategory$: Observable<Product[]> = combineLatest([this.productService.productsWithCategory$,this.categorySelectedAction$.pipe(startWith(0))]).pipe(map(([productsWithCategory,categoryId])=>{
    return productsWithCategory.filter((product:Product) => categoryId ? product.categoryId === categoryId : true);
  }),catchError((err:string)=>{
    this.errorMessage=err;
    return EMPTY;
    // return of([])
  }));


  constructor(private productService: ProductService,private productCategoryService:ProductCategoryService) { }

  ngOnDestroy(): void {
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedAction.next(+categoryId);
  }
}

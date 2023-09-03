import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  map,
  merge,
  Observable, scan, shareReplay,
  Subject,
  tap,
  throwError
} from 'rxjs';

import { Product } from '../model/product';
import {ProductCategoryService} from "../../product-categories/product-category.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  private productSelectedSubject=new BehaviorSubject<number>(1)
  productSelectedAction$=this.productSelectedSubject.asObservable()
  private productInsertSubject=new Subject<Product>()
  productInsertActionObservable$ = this.productInsertSubject.asObservable();


  products$=this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productsWithCategory$ = combineLatest([this.products$,this.poductCategoryService.productCategories$]).pipe(map(([products,categories])=>{
    return products.map((product)=>{
      product.category=categories.find(category=>category.id===product.categoryId)?.name || 'other'
      return product;
    })
  }),shareReplay(1))

  selectedProduct$ = combineLatest([this.productsWithCategory$,this.productSelectedAction$]).pipe(map(([productsWithCategory,selectedProductId])=>{
    return productsWithCategory.find(product=>product.id === selectedProductId);
  }),shareReplay(1))


  productsWithAdd$ = merge(this.productsWithCategory$,this.productInsertActionObservable$).pipe(scan((acc,value)=>{
    if(value instanceof Array){
      return [...acc,...value];
    }
    return [...acc,value];
  },[] as Product[]))

  constructor(private http: HttpClient,private poductCategoryService:ProductCategoryService) { }

  setSelectedProductId(selectedId: number) {
    this.productSelectedSubject.next(selectedId);
  }

  addProduct(product: Product) {
    this.productInsertSubject.next(product);
  }
  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}

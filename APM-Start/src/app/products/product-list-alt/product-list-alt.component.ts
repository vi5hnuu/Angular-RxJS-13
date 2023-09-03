import {ChangeDetectionStrategy, Component} from '@angular/core';

import {catchError, EMPTY, Subject} from 'rxjs';
import {ProductService} from '../service/product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  // errorMessage = ''; //on change detection onPush this wont get deteched
  private errorSubject=new Subject<string>();
  errorObservable$=this.errorSubject.asObservable();

  selectedProduct$=this.productService.selectedProduct$;
  products$=this.productService.productsWithCategory$.pipe(catchError((err:string)=>{
    this.errorSubject.next(err);
    return EMPTY;
  }))

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.setSelectedProductId(productId);
  }
}

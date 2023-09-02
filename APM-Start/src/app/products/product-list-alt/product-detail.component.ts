import { Component } from '@angular/core';
import { Supplier } from '../../suppliers/supplier';
import { Product } from '../model/product';

import { ProductService } from '../service/product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: Product | null = null;
  productSuppliers: Supplier[] | null = null;

  constructor(private productService: ProductService) { }

}

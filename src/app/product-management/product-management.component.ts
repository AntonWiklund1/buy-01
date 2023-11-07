import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  products: any[] | undefined;


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductById("Anton").subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

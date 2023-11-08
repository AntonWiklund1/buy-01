import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  products: any[] | undefined;
  username: string = localStorage.getItem('username') || '';


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log(this.username);
    this.productService.getProductById(this.username).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

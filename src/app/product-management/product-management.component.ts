import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { Renderer2, ElementRef } from '@angular/core';



@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  products: any[] | undefined;
  username: string = localStorage.getItem('username') || '';
  showProducts: boolean = false;

  constructor(private productService: ProductService,
    private renderer: Renderer2, private el: ElementRef) {}

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

  addproduct() {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    
    this.showProducts = !this.showProducts;
  }

  showProduct(){
    return this.showProducts;
  }


  closeModal() {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.removeClass(bakground, 'darkBackground');
    this.showProducts = false;
  }
}

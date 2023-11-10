import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent {
  products: any[] | undefined;
  username: string = localStorage.getItem('username') || '';
  showProducts: boolean = false;

  constructor(
    private productService: ProductService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

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
    this.closeModal();
  }

  addproduct() {
    console.log('addproduct');

    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showProducts = !this.showProducts;
  }

  createProduct() {
    console.log('createProduct');

    const newProduct = {
      name: (<HTMLInputElement>document.getElementById('name')).value,
      description: (<HTMLInputElement>document.getElementById('description')).value,
      price: (<HTMLInputElement>document.getElementById('price')).value,
      userid: localStorage.getItem('username'),
    };

    const bearer = localStorage.getItem('bearer');
    this.productService.addProduct(newProduct, bearer || '').subscribe(
      (data) => {
        console.log(data);
        this.ngOnInit();
      },
      (error) => {
        console.log(newProduct);
        console.error(error);
      }
    );
  }

  showProduct() {
    return this.showProducts;
  }

  closeModal() {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.removeClass(bakground, 'darkBackground');
    this.showProducts = false;
  }
}

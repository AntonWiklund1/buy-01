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
  editProducts: any[] | undefined;
  username: string = localStorage.getItem('username') || '';
  showProducts: boolean = false;
  showEditProducts: boolean = false;
  showMediaUploads: boolean = false;
  confirmDeleteProduct: boolean = false;

  constructor(
    private productService: ProductService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.username);
    this.productService.getProductsByUserId(this.username).subscribe(
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
    this.showEditProducts = false;
    this.showMediaUploads = false;
  }
  showEditProduct() {
    return this.showEditProducts;
  }


  editProduct(id: string) {
    console.log('editProduct');
    console.log(id);
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showEditProducts = !this.showEditProducts;


    const bearer = localStorage.getItem('bearer');

    this.productService.getProductById(id).subscribe(
      (data) => {
        this.editProducts = Array.isArray(data) ? data : [data];

        console.log(data);
      },
      (error) => {
        console.log(id);
        console.error(error);
      }
    );

  }
  updateProduct(id: string, name: string, description: string, price: string){
    console.log('updateProduct');
    const newProduct = {
      name: name,
      description: description,
      price: price,
      userid: localStorage.getItem('username'),
    };

    const bearer = localStorage.getItem('bearer');

    console.log("newProduct",id, newProduct, bearer);
    this.productService.editProduct(id,newProduct, bearer || '').subscribe(
      (data) => {
        console.log(data);
        this.ngOnInit();
      },
      (error) => {

        console.error(error);
      }
    );
  }
  confirmDelete(){
    this.confirmDeleteProduct = !this.confirmDeleteProduct;
  }
  showDelete(){
    return this.confirmDeleteProduct;
  }
  deleteProduct(id: string){
    console.log('deleteProduct');
    const bearer = localStorage.getItem('bearer');

    this.productService.deleteProduct(id, bearer || '').subscribe(
      (data) => {
        this.confirmDeleteProduct = false;
        console.log(data);
        this.ngOnInit();
      },
      (error) => {

        console.error(error);
      }
    );
  }
  uploadMedia(){

    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showMediaUploads = !this.showMediaUploads;

  }

  showMediaUpload(){
    return this.showMediaUploads;
  }
}

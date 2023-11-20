import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent {
  products: any[] | undefined;
  editProducts: any[] | undefined;
  username: string = localStorage.getItem('username') || '';
  userId: string = localStorage.getItem('userId') || '';
  showProducts: boolean = false;
  showEditProducts: boolean = false;
  showMediaUploads: boolean = false;
  confirmDeleteProduct: boolean = false;
  uploadignMediaToProduct: string = '';
  imagepath: string = '';
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs

  constructor(
    private productService: ProductService,
    private MediaService: MediaService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.username);
    this.productService.getProductsByUserId(this.userId).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error(error);
      }
    );
    this.loadProducts();
    this.closeModal();
    localStorage.removeItem('productId');
  }

  loadProducts(): void {
    this.productService.getProductsByUserId(this.userId).subscribe(
      (products) => {
        this.products = products;
        this.preloadMediaForProducts(products);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  preloadMediaForProducts(products: any[]): void {
    const backendUrl = 'https://localhost:8443/'; // Adjust this URL to where your backend serves media files
    products.forEach(product => {
      this.MediaService.getMedia(product.id).subscribe(
        (mediaDataArray) => {
          if (Array.isArray(mediaDataArray) && mediaDataArray.length > 0) {
            const mediaObject = mediaDataArray[0];
            if (mediaObject && mediaObject.imagePath) {
              const imagePath = `${backendUrl}${mediaObject.imagePath}`;
              this.productMediaUrls.set(product.id, imagePath);
            } else {
              console.error(`Media URL not found for product ${product.id}`);
              this.productMediaUrls.set(product.id, 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png');
            }
          } else {
            console.error(`Media data is not an array for product ${product.id}`);
            this.productMediaUrls.set(product.id, 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png');
          }
        },
        (error) => {
          console.error(error);
          this.productMediaUrls.set(product.id, 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png');
        }
      );
    });
  }
  
    

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
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
      id: (<HTMLInputElement>document.getElementById('name')).value,
      name: (<HTMLInputElement>document.getElementById('name')).value,
      description: (<HTMLInputElement>document.getElementById('description'))
        .value,
      price: (<HTMLInputElement>document.getElementById('price')).value,
      userid: localStorage.getItem('userId'),
    };

    const bearer = localStorage.getItem('bearer');
    console.log('bearer', bearer);
    this.productService.addProduct(newProduct, bearer || '').subscribe(
      (data) => {
        const newFileInput = document.getElementById('fileAdd') as HTMLInputElement;

        if (newFileInput && newFileInput.files && newFileInput.files.length > 0) {
          const newFile = newFileInput.files[0];
          console.log(data);
          this.MediaService.uploadMedia(newFile,data.id).subscribe(
            (data) => {
              console.log(data);
              this.closeModal();
              // Handle the response, like closing the modal or showing a success message.
            },
            (error) => {
              console.error('Upload error media error for new product:', error);
              // Handle the upload error, perhaps by showing an error message to the user.
            }
          );
        
            this.router.navigate(['/productManagement']);
        }
      },
      (error) => {
        console.log(newProduct);
        console.error("error for new product",error);
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
  updateProduct(id: string, name: string, description: string, price: string) {
    console.log('updateProduct');
    const newProduct = {
      name: name,
      description: description,
      price: price,
      userid: localStorage.getItem('userId'),
    };

    const bearer = localStorage.getItem('bearer');

    console.log('newProduct', id, newProduct, bearer);
    this.productService.editProduct(id, newProduct, bearer || '').subscribe(
      (data) => {
        console.log(data);
        this.ngOnInit();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  confirmDelete() {
    this.confirmDeleteProduct = !this.confirmDeleteProduct;
  }
  showDelete() {
    return this.confirmDeleteProduct;
  }
  deleteProduct(id: string) {
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
  showUploadMedia(productId: string) {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showMediaUploads = !this.showMediaUploads;

    localStorage.setItem('productId', productId);
    this.uploadignMediaToProduct = productId;
  }

  uploadMedia() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Access the first file in the files list
      const productId = localStorage.getItem('productId') || '';
      this.MediaService.uploadMedia(file, productId).subscribe(
        (data) => {
          console.log(data);
          this.closeModal();
          // Handle the response, like closing the modal or showing a success message.
        },
        (error) => {
          console.error('Upload error:', error);
          // Handle the upload error, perhaps by showing an error message to the user.
        }
      );
    } else {
      console.error('No file selected.');
      // Inform the user that no file was selected if that's the case.
    }
  }
  


  showMediaUpload() {
    return this.showMediaUploads;
  }
}

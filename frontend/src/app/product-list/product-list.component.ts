import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: any[] | undefined;
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs

  constructor(private productService: ProductService,    private MediaService: MediaService,
    ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error(error);
      }
    );
    this.loadProducts();

    console.log("bearer:",localStorage.getItem('bearer'));
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe(
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

}

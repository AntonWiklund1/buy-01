import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../state/auth/auth.selector';
import { AuthState } from '../state/auth/auth.reducer';
import { MediaService } from '../services/media.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.css'],
})
export class MediaManagementComponent implements OnInit {
  // Observables for user details
  username$: Observable<string | null>;
  userId$: Observable<string | null>;
  token$: Observable<string | null>;

  // Local variables to store user details
  userId: string | null | undefined;
  token: string | null | undefined;
  username: string | null | undefined;

  // Array to store all media URLs
  allMedia: { productId: string; mediaUrl: string }[] = [];

  showEdit = false;

  currentEditMediaId: string | null = null;


  constructor(
    private store: Store<{ auth: AuthState }>,
    private mediaService: MediaService,
    private productService: ProductService
  ) {
    // Selecting user details from the store
    this.username$ = this.store.select(AuthSelectors.selectUsername);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
  }

  ngOnInit(): void {
    // Subscribe to the observables to get user data
    this.userId$.pipe(take(1)).subscribe((id) => this.userId = id);
    this.token$.pipe(take(1)).subscribe((token) => this.token = token);
    this.username$.pipe(take(1)).subscribe((username) => this.username = username);

    // Fetch products after getting the user ID
    this.getProductsByUserId(this.userId || '');

    this.showEdit = false;
    this.currentEditMediaId = null;
    this.allMedia = [];

  }

  // Fetches products by user ID
  getProductsByUserId(userId: string) {
    this.productService.getProductsByUserId(userId).subscribe((products) => {
      products.forEach((product: { id: string; }) => {
        this.getMediaByProductId(product.id);
      });
    });
  }

  // Fetches media by product ID and stores URLs in an array
  getMediaByProductId(productId: string) {
    this.mediaService.getMediaByProductId(productId, this.token || '').subscribe((mediaUrls) => {
      // Create a new array of objects containing productId and mediaUrl
      const mediaObjects = mediaUrls.map(url => ({ productId, mediaUrl: url }));
      this.allMedia.push(...mediaObjects); // Adds all media objects to the array
    });
  }


  toggleEdit(mediaId?: string): void {
    this.showEdit = !this.showEdit;
    this.currentEditMediaId = mediaId || null; // Set the current media ID or clear it
    console.log(this.currentEditMediaId);
  }

  submitEditMedia() {
    const newFileInput = document.getElementById(
      'file'
    ) as HTMLInputElement;

    const file = newFileInput.files?.item(0);

    console.log(file);
    console.log(this.currentEditMediaId);
    console.log(this.token);
    if (file) {
      this.mediaService.uploadMedia(file, this.currentEditMediaId || '', this.token || '')
        .subscribe((res) => {
          console.log(res);
          setTimeout(() => {
            this.ngOnInit(); // Refresh the page
          }, 500); // Timeout for 0.5 seconds
        }, (error) => {
          console.error('Error:', error);
        });
    }
  }
}

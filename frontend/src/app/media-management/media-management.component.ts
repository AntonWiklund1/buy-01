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
  showDelete = false;

  currentEditMediaId: string | null = null;
  currentDeleteMedia: string | null = null;


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
    // Reset the component state
    this.showEdit = false;
    this.showDelete = false;
    this.currentEditMediaId = null;
    this.allMedia = [];

    // Fetch products after getting the user ID
    this.getProductsByUserId(this.userId || '');

  }

  refreshMediaList(): void {
    // Clear existing media.
    this.allMedia = [];

    // Re-fetch products and media.
    this.getProductsByUserId(this.userId || '');
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
    this.allMedia = [];
    this.mediaService.getMediaByProductId(productId, this.token || '').subscribe((mediaUrls) => {
      const mediaObjects = mediaUrls.map(url => ({ productId, mediaUrl: url }));
      this.allMedia.push(...mediaObjects);

      // Sort the allMedia array
      this.allMedia.sort((a, b) => a.productId.localeCompare(b.productId));
    });
  }



  toggleEdit(mediaId?: string): void {
    this.showEdit = !this.showEdit;
    this.currentEditMediaId = mediaId || null; // Set the current media ID or clear it
    console.log(this.currentEditMediaId);
  }

  toggleDelete(mediaId?: string): void {
    this.showDelete = !this.showDelete;
    this.currentDeleteMedia = mediaId || null;
  }

  submitEditMedia() {
    const newFileInput = document.getElementById(
      'file'
    ) as HTMLInputElement;

    const file = newFileInput.files?.item(0);

    if (file) {
      this.mediaService.uploadMedia(file, this.currentEditMediaId || '', this.token || '').subscribe((res) => {
        console.log(res);
        setTimeout(() => {
          this.refreshMediaList();
          this.showEdit = false;
        }, 500); // Timeout for 0.5 seconds
      }, (error) => {
        console.error('Error:', error);
      });
    }
  }

  submitDeleteMedia() {
    this.mediaService.deleteMedia(this.currentDeleteMedia || '', this.token || '').subscribe((res) => {
      // Remove the deleted item from the array
      this.allMedia = this.allMedia.filter(media => media.productId !== this.currentDeleteMedia);
      this.currentDeleteMedia = null;
      this.showDelete = false;
    }, (error) => {
      console.error('Error:', error);
    });
  }

}

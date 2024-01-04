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
  allMediaUrls: string[] = [];

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

    console.log(this.allMediaUrls);
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
      this.allMediaUrls.push(...mediaUrls); // Adds all URLs to the array
    });
  }
}

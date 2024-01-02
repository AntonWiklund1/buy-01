import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../state/auth/auth.selector';
import { AuthState } from '../state/auth/auth.reducer';
import { MediaService } from '../services/media.service'; // Import your media service

@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.css'],
})
export class MediaManagementComponent implements OnInit {
  username$: Observable<string | null>;
  userId$: Observable<string | null>;
  token$: Observable<string | null>;
  userId: string | null | undefined;
  token: string | null | undefined;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private mediaService: MediaService // Replace with your actual media service
  ) {
    this.username$ = this.store.select(AuthSelectors.selectUsername);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
  }

  ngOnInit(): void {
    
    // You can continue with your other code as needed for media management
  }

  // Rest of your component methods
}

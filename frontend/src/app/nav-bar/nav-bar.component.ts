import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import { selectIsAuthenticated, selectUserRole, selectUsername } from '../state/auth/auth.selector';
import { logout } from '../state/auth/auth.actions';
import { Observable, map } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as AuthSelectors from '../state/auth/auth.selector';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  username$: Observable<string>;
  private destroy$ = new Subject<void>(); // Declare the destroy$ subject here
  userId$: Observable<string | null>;
  token$: Observable<string | null>;
  userId: string | null | undefined;
  token: string | null | undefined;


  constructor(
    private router: Router,
    private mediaService: MediaService,
    private store: Store<{ auth: AuthState }>
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated); // This is where isLoggedIn$ is defined
    
    this.isAdmin$ = this.store.select(selectUserRole).pipe(
      map(role => role === 'ROLE_SELLER')
    );

    this.username$ = this.store.select(selectUsername).pipe(
      map(username => username ?? '')  // Provide an empty string as default
    );

    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
    
  }

  avatarUrl = 'assets/images/default-avatar.png';

  ngOnInit(): void {
    this.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/logIn']);
      } else {
        this.loadUserAvatar(this.userId!);
      }
    });

    this.userId$.pipe(takeUntil(this.destroy$)).subscribe(userId => {
      if (userId) {
        this.loadUserAvatar(userId);
      }
    });

    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
    });
  
    // Subscribe to the token$ observable to get the latest token
    this.token$.pipe(take(1)).subscribe((token) => {
      this.token = token;
    });
  }

  ngOnDestroy(): void {
    // Emit a value to all subscribers to trigger unsubscription
    this.destroy$.next();
    // Complete the subject to clean it up
    this.destroy$.complete();
  }

  logOut(): void {
    this.store.dispatch(logout()); // Dispatch logout action to clear the auth state
    this.router.navigate(['/login']); // Navigate to the login page
  }

  loadUserAvatar(userId: string): void {
    console.log('loadUserAvatar called');
    console.log('userId: ', userId);
    this.token$.subscribe((token) => {
      if (token && userId) {
        this.mediaService.getAvatar(userId, token).subscribe(
          (response) => {
            console.log('User avatar retrieved successfully', response);
            this.avatarUrl = `https://localhost:8443/${response}`; // Assuming the backend is hosted on localhost:8443
          },
          (error) => {
            console.error('Get user avatar error:', error);
            this.avatarUrl = 'assets/images/default-avatar.png'; // Fallback avatar
          }
        );
      }
    });
  }
}

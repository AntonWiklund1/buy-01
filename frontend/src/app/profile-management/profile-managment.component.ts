import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Observable, take } from 'rxjs';


interface Profile {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css'],
})
export class ProfileManagementComponent implements OnInit {
  username$: Observable<string | null>;
  userId$: Observable<string | null>;
  token$: Observable<string | null>;

  confirmDeleteProfile: boolean = false;
  avatarUrl: string = 'assets/images/default-avatar.png';
  confirmedProfilePicChange: boolean = false;
  errorMessage: string = '';
  userId: string | null | undefined;
  token: string | null | undefined;
  username: string | null | undefined;
  constructor(
    private store: Store<{ auth: AuthState }>,
    private userService: UserService,
    private router: Router,
    private mediaService: MediaService
  ) {
    this.username$ = this.store.select(AuthSelectors.selectUsername);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);

  }

  ngOnInit(): void {
    this.userId$.subscribe((userId) => {
      if (userId) {
        this.loadUserAvatar(userId);
      }

      this.userId$.pipe(take(1)).subscribe((id) => {
        this.userId = id;
      });
    
      // Subscribe to the token$ observable to get the latest token
      this.token$.pipe(take(1)).subscribe((token) => {
        this.token = token;
      });

      this.username$.pipe(take(1)).subscribe((username) => {
        this.username = username;
      });
    });


    // If the userID is already retrieved in the constructor, no need to get it again here
  }
  loadUserAvatar(userId: string): void {
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

  
  
  deleteProfile(): void {
    console.log('Deleting Profile');

    const bearerToken = this.token || '';

    this.userService.deleteProfile(this.userId, bearerToken).subscribe(
      () => {
        console.log('Profile deleted successfully');
        localStorage.clear(); // If you're removing all items, use clear
        this.router.navigate(['/logIn']);
      },
      (error:any) => console.error('Delete profile error:', error)
    );
  }

  toggleConfirmDelete(): void {
    this.confirmDeleteProfile = !this.confirmDeleteProfile;
  }
  // This is now a property, not a method.
  showDelete(): boolean {
    return this.confirmDeleteProfile;
  }

  // Renamed method to match your HTML template
  checkDelete(): void {
    this.confirmDeleteProfile = !this.confirmDeleteProfile;
  }

  editProfile(): void {
    console.log('Editing Profile');

    const newProfile: Profile = {
      name: this.getInputValue('newName'),
      email: this.getInputValue('newEmail'),
      password: this.getInputValue('newPassword'),
      role: this.getInputValue('newRole'),
    };

    console.log('New profile data:', newProfile);

    const userId = this.userId || '';
    const bearerToken = this.token || '';

    console.log('Bearer token:', bearerToken);
    this.userService
      .updateProfile(userId, newProfile, bearerToken)
      .subscribe(
        () => {
          console.log('Profile updated successfully');
          this.username = newProfile.name;
          
        },
        (error:any) => console.error('Update profile error:', error)
      );
  }

  private getInputValue(elementId: string): string {
    return (document.getElementById(elementId) as HTMLInputElement).value;
  }

  editProfilePicture(): void {
    console.log('Editing Profile Picture');

    const userId = this.userId || '';
    const bearerToken = this.token || '';

    const fileInput = document.getElementById('newProfilePicture') as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Access the first file in the files list
      this.mediaService.uploadAvatar(file, userId, bearerToken).subscribe(
        () => {
          console.log('Profile picture updated successfully');
          this.confirmedProfilePicChange = true;
          this.loadUserAvatar(userId);
          this.errorMessage = '';
        },
        (error) => {
          console.log(file, userId)
          if (error.status === 413) {
            this.errorMessage = 'The file is too large to upload.';
          } else if (error.status === 415) {
            this.errorMessage = 'The file type is not supported.';
          }
          console.error('Update profile picture error:', error)
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import * as AvatarActions from '../state/avatar/profile.actions'; 
import { catchError, of, switchMap, take } from 'rxjs';
import { AuthState } from '../state/auth/auth.reducer';

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
    this.store.select(AuthSelectors.selectUserId).pipe(take(1)).subscribe(id => this.userId = id);
    this.store.select(AuthSelectors.selectToken).pipe(take(1)).subscribe(token => this.token = token);
    this.store.select(AuthSelectors.selectUsername).pipe(take(1)).subscribe(username => this.username = username);
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserAvatar(this.userId);
    }
  }

  loadUserAvatar(userId: string): void {
    this.store.select(AuthSelectors.selectToken).pipe(
      take(1),
      switchMap(token => token ? this.mediaService.getAvatar(userId, token) : of(null)),
      catchError(error => {
        console.error('Get user avatar error:', error);
        return of('assets/images/default-avatar.png'); // Return the fallback avatar
      })
    ).subscribe(avatarPath => {
      this.avatarUrl = avatarPath ? `https://localhost:8443/${avatarPath}` : 'assets/images/default-avatar.png';
      console.log('User avatar retrieved successfully', avatarPath);
    });
  }

  deleteProfile(): void {
    if (this.userId && this.token) {
      this.userService.deleteProfile(this.userId, this.token).subscribe(
        () => {
          console.log('Profile deleted successfully');
          localStorage.clear();
          this.router.navigate(['/logIn']);
        },
        (error: any) => console.error('Delete profile error:', error)
      );
    }
  }

  toggleConfirmDelete(): void {
    this.confirmDeleteProfile = !this.confirmDeleteProfile;
  }

  checkDelete(): void {
    this.toggleConfirmDelete();
  }

  showDelete(): boolean {
    return this.confirmDeleteProfile;
  }

  editProfile(): void {
    const newProfile: Profile = {
      name: this.getInputValue('newName'),
      email: this.getInputValue('newEmail'),
      password: this.getInputValue('newPassword'),
      role: this.getInputValue('newRole'),
    };

    if (this.userId && this.token) {
      this.userService.updateProfile(this.userId, newProfile, this.token).subscribe(
        () => {
          console.log('Profile updated successfully');
          this.username = newProfile.name;
        },
        (error: any) => console.error('Update profile error:', error)
      );
    }
  }

  editProfilePicture(): void {
    const userId = this.userId;
    const token = this.token;

    if (userId && token) {
      const fileInput = document.getElementById('newProfilePicture') as HTMLInputElement;

      if (!fileInput?.files?.length) {
        this.errorMessage = 'No file selected for upload.';
        return;
      }

      const file = fileInput.files[0];
      this.mediaService.uploadAvatar(file, userId, token).subscribe(
        (response) => {
          const newAvatarUrl = `https://localhost:8443/${response}`;
          this.store.dispatch(AvatarActions.updateProfilePicture({ url: newAvatarUrl }));
          console.log('Profile picture updated successfully');
          this.ngOnInit(); // Reload the avatar
          this.errorMessage = ''; // Clear any previous error message
        },
        (error) => {
          this.handleProfilePictureUploadError(error);
        }
      );
    } else {
      this.errorMessage = 'Authentication required.';
    }
  }


  private getInputValue(elementId: string): string {
    return (document.getElementById(elementId) as HTMLInputElement).value;
  }

  private handleProfilePictureUploadError(error: any): void {
    if (error.status === 413) {
      this.errorMessage = 'The file is too large to upload.';
    } else if (error.status === 415) {
      this.errorMessage = 'The file type is not supported.';
    } else {
      this.errorMessage = 'An error occurred while updating the profile picture.';
    }
    console.error('Update profile picture error:', error);
  }
}

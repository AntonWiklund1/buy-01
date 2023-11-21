import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';

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
  username: string;
  userId: string;
  confirmDeleteProfile: boolean = false;
  avatarUrl: string = 'assets/images/default-avatar.png';
  confirmedProfilePicChange: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private mediaService: MediaService
  ) {
    this.username = localStorage.getItem('username') || '';
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    console.log('Username:', this.username);
    console.log('UserID:', this.userId);
    this.loadUserAvatar();

    // If the userID is already retrieved in the constructor, no need to get it again here
  }
  loadUserAvatar(): void {
    const userId = localStorage.getItem('userId') || '';
    const bearerToken = localStorage.getItem('bearer') || '';
  
    this.mediaService.getAvatar(userId, bearerToken).subscribe(
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
  
  
  deleteProfile(): void {
    console.log('Deleting Profile');
    const userId = this.userId;
    const bearerToken = localStorage.getItem('bearer') || '';

    this.userService.deleteProfile(userId, bearerToken).subscribe(
      () => {
        console.log('Profile deleted successfully');
        localStorage.clear(); // If you're removing all items, use clear
        this.router.navigate(['/logIn']);
      },
      (error) => console.error('Delete profile error:', error)
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

    const userId = localStorage.getItem('userId') || '';
    const bearerToken = localStorage.getItem('bearer') || '';

    console.log('Bearer token:', bearerToken);
    this.userService
      .updateProfile(userId, newProfile, localStorage.getItem('bearer') || '')
      .subscribe(
        () => {
          const logInNewProfile = {
            username: newProfile.name,
            password: newProfile.password,
          };
          this.userService.logIn(logInNewProfile).subscribe(
            (response) => {
              console.log('User logged in', response);
              const bearer = Object.values(response)[1];
              const userId = Object.values(response)[0];
              localStorage.setItem('bearer', bearer);
              localStorage.setItem('userId', userId);
              this.router.navigate(['/profileManagement']);
            },
            (error) => {
              console.error('Log in error:', error);
            }
          );
          console.log('Profile updated successfully');
          this.username = newProfile.name;
          localStorage.setItem('username', newProfile.name);
        },
        (error) => console.error('Update profile error:', error)
      );
  }

  private getInputValue(elementId: string): string {
    return (document.getElementById(elementId) as HTMLInputElement).value;
  }

  editProfilePicture(): void {
    console.log('Editing Profile Picture');

    const userId = localStorage.getItem('userId') || '';
    const bearerToken = localStorage.getItem('bearer') || '';

    const fileInput = document.getElementById('newProfilePicture') as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Access the first file in the files list
      this.mediaService.uploadAvatar(file, userId, bearerToken).subscribe(
        () => {
          console.log('Profile picture updated successfully');
          this.confirmedProfilePicChange = true;
          this.loadUserAvatar();
        },
        (error) => {
          console.log(file, userId)
          console.error('Update profile picture error:', error)
        }
      );
    }
  }
}

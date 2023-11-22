import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Adjust the path as necessary
import { AuthService } from '../services/auth.service';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css'],
})
export class LogInComponent {
  username: any;
  email: any;
  password: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private mediaService: MediaService
  ) {}

  signUp: boolean = false;
  logIn: boolean = true;
  isSeller: boolean = false;

  errorMessage: string = '';

  userRole: string = '';
  showEmail() {
    return this.signUp;
  }
  hideLogIn() {
    return this.signUp;
  }
  goLogIn() {
    this.signUp = false;
    this.logIn = true;
    this.isSeller = false;
    return this.logIn;
  }
  showLogIn() {
    return this.logIn;
  }
  showSignUp() {
    return this.signUp;
  }
  goSignUp() {
    this.logIn = false;
    this.signUp = true;

    return this.signUp;
  }

  validatePassword() {
    var password = (<HTMLInputElement>document.getElementById('password'))
      .value;
    var confirmPassword = (<HTMLInputElement>(
      document.getElementById('confirmPassword')
    )).value;
    if (password.length == 0 && confirmPassword.length == 0) {
      return false;
    } else if (password != confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }

  validateForm() {
    // Check if the password validation is successful
    if (this.validatePassword()) {
      // Use the authService to get the JWT token
      console.log('isSeller', this.isSeller);
      var role = 'admin';
      var jwtPassword = 'admin';

      this.authService.getJwtToken(role, jwtPassword).subscribe({
        next: (jwtToken) => {
          // jwtToken is now just a string, not an object
          console.log('JWT Token:', jwtToken);
          const bearer = Object.values(jwtToken)[1];
          localStorage.setItem('bearer', bearer);
          role = this.isSeller ? 'ROLE_ADMIN' : 'ROLE_USER';
          // Assuming you want to use the JWT token immediately to create a user
          const newUser = {
            id: this.username,
            name: this.username,
            password: this.password,
            email: this.email,
            role: role,
          };

          // Call the userService to create a new user
          // Make sure to include the JWT token in your request if needed
          this.userService
            .createUser(newUser, localStorage.getItem('bearer') || '')
            .subscribe({
              next: (response) => {
                console.log('User created', response);
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', this.username);
                localStorage.setItem('userId', this.username);
                this.getRole();

                const fileInput = document.getElementById('mediaUpload') as HTMLInputElement;
                if ( fileInput && fileInput.files && fileInput.files.length > 0 ) {
                  const file = fileInput.files[0]; // Access the first file in the files list
                  const userId = localStorage.getItem('userId') || '';
                  const bearerToken = localStorage.getItem('bearer') || '';

                  this.mediaService.uploadAvatar(file, userId, bearerToken).subscribe(
                      () => {
                        console.log('Profile picture updated successfully');
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
                // Handle response upon successful user creation
                // Navigate to the desired route upon success
                this.router.navigate(['/']);
              },
              error: (userError) => {
                this.errorMessage = userError.error;
                console.error('Error creating user', userError);
              },
            });
        },
        error: (error) => {
          console.error('Error obtaining JWT token', error);
        },
      });
      return true;
    } else {
      return false;
    }
  }
  //log in
  LogIn() {
    interface responseGet {
      id: string;
      username: string;
      role: string;
    }
    const user = {
      username: this.username,
      password: this.password,
    };
    this.userService.logIn(user).subscribe({
      next: (response) => {
        console.log('User logged in', response);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', this.username);

        const bearer = Object.values(response)[1];
        const userId = Object.values(response)[0];
        localStorage.setItem('bearer', bearer);
        localStorage.setItem('userId', userId);
        this.getRole();
        this.router.navigate(['/']);
      },
      error: (userError) => {
        this.errorMessage = 'Username or password is incorrect';
        // Handle any errors here, such as showing an error message to the user
        console.log(this.username, this.password);
        console.error('Error logging in', userError);
      },
    });
  }

  getRole() {
    const token = localStorage.getItem('bearer') || '';

    this.userService.getUser(localStorage.getItem('userId'), token).subscribe({
      next: (userProfile) => {
        this.userRole = Object.values(userProfile)[2];
        localStorage.setItem('role', this.userRole);
      },
      error: (userError) => {
        console.error(userError);
        this.errorMessage = userError.error.message;
      },
    });
  }

  // File upload
  selectedFileName: string = '';

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    this.selectedFileName = fileInput.files?.[0]?.name || '';
    // Add additional logic if needed
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('mediaUpload');
    if (fileInput) {
      fileInput.click();
    }
  }
}

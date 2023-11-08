import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Adjust the path as necessary
import { AuthService } from '../services/auth.service';
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
    private authService: AuthService
  ) {}

  signUp: boolean = false;
  logIn: boolean = true;
  isSeller: boolean = false;

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
      alert('Passwords do not match.');
      return false;
    }

    return true;
  }

  validateForm() {
    // Check if the password validation is successful
    if (this.validatePassword()) {
      // Use the authService to get the JWT token

      var role = 'admin';
      var jwtPassword = 'password';
    
      this.authService.getJwtToken(role, jwtPassword).subscribe({
        next: (jwtToken) => { // jwtToken is now just a string, not an object
          console.log("JWT Token:", jwtToken);
          // Assuming you want to use the JWT token immediately to create a user
          const newUser = {
            id: this.username,
            name: this.username,
            password: this.password,
            email: this.email,
            role: this.isSeller ? 'ROLE_ADMIN' : 'ROLE_USER',
          };
  
          // Call the userService to create a new user
          // Make sure to include the JWT token in your request if needed
          this.userService.createUser(newUser, jwtToken).subscribe({
            next: (response) => {
              console.log("User created", response);
              localStorage.setItem('loggedIn', 'true');
              localStorage.setItem('username', this.username);
              // Handle response upon successful user creation
              // Navigate to the desired route upon success
              this.router.navigate(['/']);
            },
            error: (userError) => {
              // Handle any errors here, such as showing an error message to the user
              console.error("Error creating user", userError);
            }
          });
        },
        error: (error) => {
          console.error("Error obtaining JWT token", error);
        }
      });

      return true;
    } else {
      return false;
    }
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

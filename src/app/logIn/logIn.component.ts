import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css']
})
export class LogInComponent{
  constructor() { }
  signUp: boolean = false;
  logIn: boolean = true;
  isSeller: boolean = false;
  showEmail() {
    return this.signUp
  }
  hideLogIn() {
    return this.signUp
  }
  goLogIn() {
    this.signUp = false;
    this.logIn = true;
    this.isSeller = false;
    return this.logIn
  }
  showLogIn() {
    
    return this.logIn;
  }
  showSignUp(){
    
    return this.signUp;
  }
  goSignUp() {
    this.logIn = false;
    this.signUp = true;
    return this.signUp
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



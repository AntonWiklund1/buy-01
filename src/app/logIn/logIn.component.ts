import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css']
})
export class LogInComponent {
  constructor() { }
  signUp: boolean = false;
  logIn: boolean = true;
  
  showEmail() {
    return this.signUp
  }
  hideLogIn() {
    return this.signUp
  }
  goLogIn() {
    this.signUp = false;
    this.logIn = true;
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
}



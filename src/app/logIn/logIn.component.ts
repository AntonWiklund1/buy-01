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
  goSignUp() {
    this.signUp = true;
    return this.signUp
  }
  showEmail() {
    return this.signUp
  }
  hideLogIn() {
    return this.signUp
  }
  goLogIn() {
    console.log("show login",this.logIn)
    this.logIn = true;
    return this.logIn;
  }
  showLogIn() {
    this.logIn = true;
    
    return this.logIn;
  }
}



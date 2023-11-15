import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements  OnInit{
  constructor(
    private router: Router
  ) { }

  showNavBar = false;
  username = localStorage.getItem('username');
  ngOnInit(): void {
    this.isLoggedIn();
    this.checkLogInStatus();
    console.log("loged in = ",this.isLoggedIn());
    this.username = localStorage.getItem('username');
  }
  isLoggedIn(){
    return localStorage.getItem('loggedIn') || false;
  }
  logOut(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('bearer');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.checkLogInStatus();
  }
  isAdmin(){
    return localStorage.getItem('role') === 'ROLE_ADMIN';
  }
  checkLogInStatus(){
    if (!this.isLoggedIn()){
      this.router.navigate(['/logIn']);
    }
  }
}

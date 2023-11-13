import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements  OnInit{
  constructor() { }
  showNavBar = false;
  ngOnInit(): void {
    this.isLoggedIn();
    console.log("loged in = ",this.isLoggedIn());
  }
  isLoggedIn(){
    return localStorage.getItem('loggedIn') || false;
  }
  logOut(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('bearer');
  }
  isAdmin(){
    return localStorage.getItem('role') === 'ROLE_ADMIN';
  }
}

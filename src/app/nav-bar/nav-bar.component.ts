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
    console.log(this.isLoggedIn());
  }
  isLoggedIn(){
    return localStorage.getItem('loggedIn') || false;
  }
  logOut(){
    localStorage.removeItem('loggedIn');
  }
  logIn(){
    localStorage.setItem('loggedIn', 'true');
  }

  toggleNavBar(){
    console.log(this.showNavBar);
    this.showNavBar = !this.showNavBar;
    return this.showNavBar
  }
  showNav(){
    console.log("show",this.showNavBar);
    return this.showNavBar
  }
}

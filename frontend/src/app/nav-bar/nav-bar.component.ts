import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements  OnInit{
  constructor(
    private router: Router,
    private mediaService: MediaService
  ) { }
avatarUrl = 'assets/images/default-avatar.png';
  showNavBar = false;
  username = localStorage.getItem('username');
  ngOnInit(): void {
    this.isLoggedIn();
    this.checkLogInStatus();
    console.log("loged in = ",this.isLoggedIn());
    this.username = localStorage.getItem('username');
    this.loadUserAvatar();
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
    return localStorage.getItem('role') === 'ROLE_SELLER';
  }
  checkLogInStatus(){
    if (!this.isLoggedIn()){
      this.router.navigate(['/logIn']);
    }
  }
  loadUserAvatar(): void {
    const userId = localStorage.getItem('userId') || '';
    const bearerToken = localStorage.getItem('bearer') || '';
  
    this.mediaService.getAvatar(userId, bearerToken).subscribe(
      (response) => {
        console.log('User avatar retrieved successfully navbar', response);
        this.avatarUrl = `https://localhost:8443/${response}`; // Assuming the backend is hosted on localhost:8443
      },
      (error) => {
        console.error('Get user avatar error:', error);
        this.avatarUrl = 'assets/images/default-avatar.png'; // Fallback avatar
      }
    );
  }
}

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-managment',
  templateUrl: './profile-managment.component.html',
  styleUrls: ['./profile-managment.component.css'],
})
export class ProfileManagmentComponent {
  username: string = localStorage.getItem('username') || '';
  confirmDeleteProduct: boolean = false;

  constructor(
    private UserService: UserService,
    private router: Router
    ) {}

  ngOnInit(): void {
    console.log(this.username);
    this.getUser();
  }

  getUser() {
    this.UserService.getUser(this.username,localStorage.getItem('bearer') || '').subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  deleteProfile(){
    console.log("deleteProfile");
    this.UserService.deleteProfile(this.username,localStorage.getItem('bearer') || '').subscribe(
      (data) => {
        console.log(data);
        localStorage.removeItem('username');
        localStorage.removeItem('bearer');
        this.router.navigate(['/logIn']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  checkDelete(){
    this.confirmDeleteProduct = !this.confirmDeleteProduct;
  }
  showDelete(){
    return this.confirmDeleteProduct;
  }
  editProfile(){
    console.log("editProfile");

    const newProfile = {
      username: (<HTMLInputElement>document.getElementById('newName')).value,
      email: (<HTMLInputElement>document.getElementById('newEmail')).value,
      password: (<HTMLInputElement>document.getElementById('newPassword')).value,
      role: (<HTMLInputElement>document.getElementById('newRole')).value,
    };

    console.log(newProfile);


    this.UserService.updateProfile(this.username, newProfile, localStorage.getItem('bearer') || '').subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

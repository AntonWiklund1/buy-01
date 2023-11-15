import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-managment',
  templateUrl: './profile-managment.component.html',
  styleUrls: ['./profile-managment.component.css'],
})
export class ProfileManagmentComponent {
  username: any = localStorage.getItem('username') || '';
  confirmDeleteProduct: boolean = false;
  userId: any = localStorage.getItem('userId') || '';
  constructor(
    private UserService: UserService,
    private router: Router
    ) {}

  ngOnInit(): void {
    console.log(this.username);
    console.log("userid",this.userId);
    this.userId = localStorage.getItem('userId');
    // this.getUser();
  }

  // getUser() {
  //   this.UserService.getUser(localStorage.getItem('userId'),localStorage.getItem('bearer') || '').subscribe(
  //     (data) => {
  //       console.log("username:",this.username);
  //       console.log(data);
  //     },
  //     (error) => {
  //       console.log("get users parameters:",localStorage.getItem('userId'),"and",localStorage.getItem('bearer'))
  //       console.error(error);
  //     }
  //   );
  // }
  deleteProfile(){
    console.log("deleteProfile");
    this.UserService.deleteProfile(localStorage.getItem('userId'),localStorage.getItem('bearer') || '').subscribe(
      (data) => {
        console.log(data);
        localStorage.removeItem('username');
        localStorage.removeItem('bearer');
        localStorage.removeItem('userId');
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
      name: (<HTMLInputElement>document.getElementById('newName')).value,
      email: (<HTMLInputElement>document.getElementById('newEmail')).value,
      password: (<HTMLInputElement>document.getElementById('newPassword')).value,
      role: (<HTMLInputElement>document.getElementById('newRole')).value,
    };

    console.log(newProfile);


    this.UserService.updateProfile(localStorage.getItem("userId") || '', newProfile, localStorage.getItem('bearer') || '').subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('username', newProfile.name);

      },
      (error) => {
        console.error(error);
      }
    );
  }
  editProfilePicture(){
    console.log("editProfilePicture");
  }
}

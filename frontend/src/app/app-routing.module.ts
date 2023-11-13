import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './logIn/logIn.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import {ProductManagementComponent} from './product-management/product-management.component';
import { ProfileManagmentComponent } from './profile-managment/profile-managment.component';

const routes: Routes = [
  { path: 'logIn', component: LogInComponent },
  { path: 'nav-bar', component: NavBarComponent},
  { path: 'productList', component: ProductListComponent},
  { path: 'productManagement', component: ProductManagementComponent},
  { path: 'profileManagment', component: ProfileManagmentComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

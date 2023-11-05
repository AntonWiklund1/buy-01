import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './logIn/logIn.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms'; // Make sure it's imported from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    NavBarComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Import FormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

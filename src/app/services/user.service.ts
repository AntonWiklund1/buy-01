import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiCreateUserUrl = 'https://localhost:8443/api/users';
  private apiGetUserUrl = 'https://localhost:8443/api/users';
  private apiLogInUrl = 'https://localhost:8443/api/auth/login';
  constructor(private http: HttpClient) {}

  // Create a new user with JWT token
  createUser(user: any, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log("createUser", user, token) ;
    return this.http.post(this.apiCreateUserUrl, user, { headers: headers });
  }

  //get user by id

  getUser(id: any, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log("got user", id, token) ;
    return this.http.get(`${this.apiGetUserUrl}/${id}`, { headers: headers });
  }
  
  logIn(user: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log("logIn", user) ;
    return this.http.post(this.apiLogInUrl, user, { headers: headers });

  }
  
  
  
  
  
}

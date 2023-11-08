import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:8443/api/users';

  constructor(private http: HttpClient) {}

  // Create a new user with JWT token
  createUser(user: any, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log("createUser", user, token) ;
    return this.http.post(this.apiUrl, user, { headers: headers });
  }

  
  
  
  
  
  
  
}

// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private authUrl = 'https://localhost:8443/api/auth'; // Your API endpoint

    constructor(private http: HttpClient) {}


    //get jwt token
    getJwtToken(username: string, password: string) {
        console.log("getJwtToken", username, password)  ;
        return this.http.post(this.authUrl, { username, password }, { responseType: 'text' });

      }
      
}

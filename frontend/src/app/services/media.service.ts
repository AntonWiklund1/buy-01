import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
    private apiUploadUrl = 'https://localhost:8443/media/upload';
    private apiGetMediaUrl = 'https://localhost:8443/media/product/';
    private apiUploadAvatarUrl = 'https://localhost:8443/api/users';
    private apiGetAvatarUrl = 'https://localhost:8443/api/users';
  
    constructor(private http: HttpClient) {}
  
    // Upload media
    uploadMedia(media: File, productId: string) {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('file', media);
  
      // No need to set the Content-Type header, HttpClient will set it automatically
      return this.http.post(this.apiUploadUrl, formData);
    }

    //get media
    getMedia(productId: string) {
      return this.http.get(this.apiGetMediaUrl + productId);
    }

    //upload avatar
    uploadAvatar(avatar: File, userId: string, token: string) {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const headers = new HttpHeaders({ 
        'Authorization': `Bearer ${token}` 
      });

      // No need to set the Content-Type header, HttpClient will set it automatically
      return this.http.post(`${this.apiUploadAvatarUrl}/${userId}` +  '/avatar', formData ,{ headers: headers, responseType: 'text'});
    }

    //get avatar
    getAvatar(userId: string, token: string) {

      const headers = new HttpHeaders({ 
        'Authorization': `Bearer ${token}` 
      });

      return this.http.get(`${this.apiGetAvatarUrl}/${userId}` + '/avatar' ,{ headers: headers, responseType: 'text'});
    }
  }
  

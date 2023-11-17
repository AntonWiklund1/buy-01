import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
    private apiUploadUrl = 'https://localhost:8443/media/upload';
  
    constructor(private http: HttpClient) {}
  
    // Upload media
    uploadMedia(media: File, productId: string) {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('file', media);
  
      // No need to set the Content-Type header, HttpClient will set it automatically
      return this.http.post(this.apiUploadUrl, formData);
    }
  }
  

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlGetAllproducts = 'https://localhost:8443/api/products'; // replace with your Spring Boot API endpoint
  private apiUrlGetProductById = 'https://localhost:8443/api/products/user/'; // replace with your Spring Boot API endpoint
  private apiUrlAddProduct = 'https://localhost:8443/api/products'; // replace with your Spring Boot API endpoint

  private id: string | undefined;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrlGetAllproducts);
  }

  getProductById(id: string): Observable<any> {
    this.id = 'Anton';
    return this.http.get<any>(this.apiUrlGetProductById + id);
  }

  addProduct(product: any, token: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<any>(this.apiUrlAddProduct, product, { headers });
  }
}

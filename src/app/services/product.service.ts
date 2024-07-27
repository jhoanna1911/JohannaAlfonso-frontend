// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.apiUrl}/products`);
  }

  /*  getProducts(): Observable<{ data: Product[] }> {
      // Aquí usaremos datos falsos en lugar de llamar al backend
      const fakeProducts: Product[] = [
        { id: 1, name: 'Producto 1', description: 'Descripción 1', logo: 'assets/logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
        { id: 2, name: 'Producto 2', description: 'Descripción 2', logo: 'assets/logo2.png', releaseDate: '2025-01-02', restoreDate: '2026-01-02' },
        { id: 3, name: 'Producto 3', description: 'Descripción 3', logo: 'assets/logo3.png', releaseDate: '2025-01-03', restoreDate: '2026-01-03' },
        { id: 4, name: 'Producto 4', description: 'Descripción 4', logo: 'assets/logo4.png', releaseDate: '2025-01-04', restoreDate: '2026-01-04' },
        { id: 5, name: 'Producto 5', description: 'Descripción 5', logo: 'assets/logo5.png', releaseDate: '2025-01-05', restoreDate: '2026-01-05' },
        { id: 6, name: 'Producto 6', description: 'Descripción 6', logo: 'assets/logo6.png', releaseDate: '2025-01-06', restoreDate: '2026-01-06' },
        { id: 7, name: 'Producto 7', description: 'Descripción 7', logo: 'assets/logo7.png', releaseDate: '2025-01-07', restoreDate: '2026-01-07' },
        { id: 8, name: 'Producto 8', description: 'Descripción 8', logo: 'assets/logo8.png', releaseDate: '2025-01-08', restoreDate: '2026-01-08' },
        { id: 9, name: 'Producto 9', description: 'Descripción 9', logo: 'assets/logo9.png', releaseDate: '2025-01-09', restoreDate: '2026-01-09' },
        { id: 10, name: 'Producto 10', description: 'Descripción 10', logo: 'assets/logo10.png', releaseDate: '2025-01-10', restoreDate: '2026-01-10' }
      ];
      return of({ data: fakeProducts });
    }*/

  verifyIdentifier(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<{ message: string; data: Product }> {
    return this.http.post<{ message: string; data: Product }>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<{ message: string; data: Product }> {
    return this.http.put<{ message: string; data: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  checkProductId(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${id}`);
  }
}

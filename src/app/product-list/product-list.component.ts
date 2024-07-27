import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchQuery = '';
  itemsPerPageOptions = [5, 10, 20];
  itemsPerPage = 5;
  totalResults = 0;
  currentPage = 1;
  totalPages = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((response) => {
      this.products = response.data;
      this.filteredProducts = this.products.slice(0, this.itemsPerPage);
      this.totalResults = this.products.length;
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.filteredProducts = this.products.filter(product =>
      product.name.includes(query) || product.description.includes(query)
    ).slice(0, this.itemsPerPage);
  }

  onItemsPerPageChange(value: any): void {
    this.itemsPerPage = parseInt(value, 10);
    this.filteredProducts = this.products.slice(0, this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  onEditProduct(id: number): void {
    this.router.navigate([`/edit-product/${id}`]);
  }
}

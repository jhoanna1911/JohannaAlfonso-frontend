import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';

class MockProductService {
  getProducts() {
    return of({
      data: [
        { id: 1, name: 'Product 1', description: 'Description 1', logo: 'logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
        { id: 2, name: 'Product 2', description: 'Description 2', logo: 'logo2.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
        { id: 3, name: 'Product 3', description: 'Description 3', logo: 'logo3.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' }
      ]
    });
  }
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        ProductListComponent,
        SearchBarComponent
      ],
      imports: [ 
        HttpClientTestingModule, 
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    spyOn(productService, 'getProducts').and.callThrough();
    component.ngOnInit();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(3);
    expect(component.filteredProducts.length).toBe(3);
    expect(component.totalResults).toBe(3);
  });

  it('should filter products based on search query', () => {
    component.products = [
      { id: 1, name: 'Product 1', description: 'Description 1', logo: 'logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 2, name: 'Product 2', description: 'Description 2', logo: 'logo2.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 3, name: 'Product 3', description: 'Description 3', logo: 'logo3.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' }
    ];
    component.onSearch('Product 1');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product 1');
  });

  it('should change items per page', () => {
    component.products = [
      { id: 1, name: 'Product 1', description: 'Description 1', logo: 'logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 2, name: 'Product 2', description: 'Description 2', logo: 'logo2.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 3, name: 'Product 3', description: 'Description 3', logo: 'logo3.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' }
    ];
    component.onItemsPerPageChange(2);
    expect(component.itemsPerPage).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should navigate to add product page', () => {
    spyOn(router, 'navigate');
    component.onAddProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should navigate to edit product page', () => {
    spyOn(router, 'navigate');
    component.onEditProduct(1);
    expect(router.navigate).toHaveBeenCalledWith(['/edit-product/1']);
  });

  it('should paginate products', () => {
    component.filteredProducts = [
      { id: 1, name: 'Product 1', description: 'Description 1', logo: 'logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 2, name: 'Product 2', description: 'Description 2', logo: 'logo2.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 3, name: 'Product 3', description: 'Description 3', logo: 'logo3.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' }
    ];
    component.itemsPerPage = 2;
    component.updatePagination();
    expect(component.paginatedProducts.length).toBe(2);
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should update pagination correctly', () => {
    component.products = [
      { id: 1, name: 'Product 1', description: 'Description 1', logo: 'logo1.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 2, name: 'Product 2', description: 'Description 2', logo: 'logo2.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' },
      { id: 3, name: 'Product 3', description: 'Description 3', logo: 'logo3.png', releaseDate: '2025-01-01', restoreDate: '2026-01-01' }
    ];
    component.itemsPerPage = 2;
    component.updatePagination();
    expect(component.paginatedProducts.length).toBe(2);
    component.currentPage = 2;
    component.updatePagination();
    expect(component.paginatedProducts.length).toBe(1);  
  });
});

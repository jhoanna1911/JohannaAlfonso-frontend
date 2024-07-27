import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

class MockProductService {
  getProductById(id: number) {
    return of({
      id: id,
      name: 'Product Test',
      description: 'Description Test',
      logo: 'logo.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    });
  }

  updateProduct(id: number, product: Product) {
    return of({});
  }
}

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule, FormsModule ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    spyOn(productService, 'getProductById').and.callThrough();
    component.ngOnInit();
    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product.name).toBe('Product Test');
  });

  it('should call updateProduct and navigate when form is valid', () => {
    spyOn(productService, 'updateProduct').and.callThrough();
    const navigateSpy = spyOn(router, 'navigate');
    component.product = {
      id: 1,
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    };
    component.onSubmit();
    expect(productService.updateProduct).toHaveBeenCalledWith(1, component.product);
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should reset the form on reset', () => {
    spyOn(component, 'ngOnInit');
    component.onReset();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should return true for isValidForm', () => {
    expect(component.isValidForm()).toBeTrue();
  });
});

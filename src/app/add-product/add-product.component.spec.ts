import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { AddProductComponent } from './add-product.component';
import { Product } from '../models/product.model';

class MockProductService {
  addProduct(product: Product) {
    return of({ message: 'Product added successfully', data: product });
  }
  checkProductId(id: number) {
    return of(false);
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.product = {
      id: 1,
      name: 'Producto Test',
      description: 'Descripción Test',
      logo: 'assets/logo1.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    };
    expect(component.isValidForm()).toBeTrue();
  });

  it('should call addProduct and navigate when form is valid', () => {
    spyOn(productService, 'addProduct').and.callThrough();
    component.product = {
      id: 1,
      name: 'Producto Test',
      description: 'Descripción Test',
      logo: 'assets/logo1.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    };
    component.onSubmit();
    expect(productService.addProduct).toHaveBeenCalledWith({
      id: 1,
      name: 'Producto Test',
      description: 'Descripción Test',
      logo: 'assets/logo1.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should show an error if ID already exists', () => {
    spyOn(productService, 'checkProductId').and.returnValue(of(true));
    component.product.id = 1;
    component.checkIdAvailability();
    expect(component.idError).toBe('ID ya existe');
  });

  it('should reset the form when resetForm is called', () => {
    component.product = {
      id: 1,
      name: 'Producto Test',
      description: 'Descripción Test',
      logo: 'assets/logo1.png',
      releaseDate: '2025-01-01',
      restoreDate: '2026-01-01'
    };
    component.resetForm();
    expect(component.product).toEqual({
      id: 0,
      name: '',
      description: '',
      logo: '',
      releaseDate: '',
      restoreDate: ''
    });
  });

  it('should invalidate the form if releaseDate is in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    component.product.releaseDate = yesterday.toISOString().split('T')[0];
    expect(component.isValidForm()).toBeFalse();
  });

  it('should invalidate the form if restoreDate is not one year after releaseDate', () => {
    component.product.releaseDate = '2025-01-01';
    component.product.restoreDate = '2025-12-31'; 
    expect(component.isValidForm()).toBeFalse();
  });
});

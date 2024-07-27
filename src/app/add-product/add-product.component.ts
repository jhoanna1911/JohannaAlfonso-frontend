import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  product = {
    id: 0,
    name: '',
    description: '',
    logo: '',
    releaseDate: '',
    restoreDate: ''
  };
  idError: string | null = null;
  releaseDateError: string | null = null;
  restoreDateError: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  onSubmit(): void {
    if (this.isValidForm()) {
      const productToAdd: Product = {
        id: Number(this.product.id), 
        name: this.product.name,
        description: this.product.description,
        logo: this.product.logo,
        releaseDate: this.product.releaseDate,
        restoreDate: this.product.restoreDate
      };

      this.productService.addProduct(productToAdd).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  checkIdAvailability(): void {
    this.productService.checkProductId(this.product.id).subscribe(
      (exists) => {
        if (exists) {
          this.idError = 'ID ya existe';
        } else {
          this.idError = null;
        }
      },
      () => {
        this.idError = 'Error al verificar ID';
      }
    );
  }

  resetForm(): void {
    this.product = {
      id: 0,
      name: '',
      description: '',
      logo: '',
      releaseDate: '',
      restoreDate: ''
    };
    this.idError = null;
    this.releaseDateError = null;
    this.restoreDateError = null;
  }

  isValidForm(): boolean {
    const releaseDate = new Date(this.product.releaseDate);
    const restoreDate = new Date(this.product.restoreDate);
    const today = new Date();

    this.releaseDateError = null;
    this.restoreDateError = null;

    if (releaseDate < today) {
      this.releaseDateError = 'Fecha de liberación es requerida y debe ser igual o mayor a la fecha actual.';
      return false;
    }

    const oneYearLater = new Date(releaseDate);
    oneYearLater.setFullYear(releaseDate.getFullYear() + 1);

    if (restoreDate.toDateString() !== oneYearLater.toDateString()) {
      this.restoreDateError = 'Fecha de restauración es requerida y debe ser exactamente un año posterior a la fecha de liberación.';
      return false;
    }

    return true;
  }
}

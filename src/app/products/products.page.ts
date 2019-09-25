import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';
import { Product } from './product.model';
import { LoadingController } from '@ionic/angular';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products;
  productsRep;
  isLoading = true;
  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.sharedService.products.subscribe((products: any) => {
      this.isLoading = false;
      this.products = products;
      this.productsRep = this.products.sort((a, b) => (new Date(a.expDate).getTime() > new Date(b.expDate).getTime()) ? 1 : -1);
    });
  }


  getItems(event) {
    this.productsRep = this.products;
    if (event.target.value.trim() !== '') {
      this.productsRep = this.products.filter((i) => {
        return i.name.toLowerCase().includes(event.target.value.toLowerCase().trim())
        || i.category.name.toLowerCase().includes(event.target.value.toLowerCase().trim())
        || i.available.toString().toLowerCase().includes(event.target.value.toLowerCase().trim());
      });
    }
  }
}

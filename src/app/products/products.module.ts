import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPage } from './products.page';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { HomePage } from './product-home/home.page';
import { ProductsRoutingModule } from './products-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsRoutingModule
  ],
  declarations: [HomePage, ProductsPage, ProductListComponent, ProductItemComponent]
})
export class ProductsPageModule {}

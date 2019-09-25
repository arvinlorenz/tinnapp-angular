import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Screenshot } from '@ionic-native/screenshot/ngx';

import { OrderReceiptPage } from './order-receipt.page';

const routes: Routes = [
  {
    path: '',
    component: OrderReceiptPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [Screenshot],
  declarations: [OrderReceiptPage]
})
export class OrderReceiptPageModule {}

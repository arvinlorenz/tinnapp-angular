import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductEditPage } from './product-edit.page';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';

const routes: Routes = [
  {
    path: '',
    component: ProductEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductEditPage, ImagePickerComponent]
})
export class ProductEditPageModule {}

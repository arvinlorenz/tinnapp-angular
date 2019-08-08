import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './product-home/home.page';
import { ProductsPage } from './products.page';

const routes: Routes = [
    {
      path: 'tabs',
      component: HomePage,
      children: [
        {
          path: 'items',
          children: [
            {
              path: '',
              component: ProductsPage
            },
            {
              path: 'new',
              loadChildren: './product-edit/product-edit.module#ProductEditPageModule'
            },
            {
              path: 'edit/:productId',
              loadChildren: './product-edit/product-edit.module#ProductEditPageModule'
            },
            {
              path: ':productId',
              // loadChildren: './product-detail/product-detail.module#ProductDetailPageModule'
              loadChildren: './product-edit/product-edit.module#ProductEditPageModule'
            },
          ]
        },
        {
          path: 'categories',
          children: [
            {
              path: '',
              loadChildren: './categories/categories.module#CategoriesPageModule'
            },
            {
              path: 'new',
              loadChildren: './categories/category-edit/category-edit.module#CategoryEditPageModule'
            },
            {
              path: ':categoryId',
              loadChildren: './categories/category-edit/category-edit.module#CategoryEditPageModule'
            }
          ]
        },
        {
          path: '',
          redirectTo: '/products/tabs/items',
          pathMatch: 'full'
        },
      ]
    },
    {
      path: '',
      redirectTo: '/products/tabs/items',
      pathMatch: 'full'
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule {}

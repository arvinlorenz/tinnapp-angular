import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersPage } from './users.page';


const routes: Routes = [
    {
        path: '',
        component: UsersPage
    },
    { path: 'new', loadChildren: './user-edit/user-edit.module#UserEditPageModule' },
    { path: ':userId', loadChildren: './user-edit/user-edit.module#UserEditPageModule' },

  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}

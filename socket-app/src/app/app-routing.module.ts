import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PrsComponent } from './pages/prs/prs.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { test: 'test' }
    },
    {
        path: 'prs',
        component: PrsComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
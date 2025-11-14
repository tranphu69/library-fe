import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { AuthLayout } from './auth-layout/auth-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MainLayout,
    AuthLayout
  ],
  exports: [
    MainLayout,
    AuthLayout
  ]
})
export class LayoutsModule { }
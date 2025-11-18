import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './page/page';
import { SharedModule } from '../../shared/shared.module';
import { PermissionRoutingModule } from './permission-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    PermissionRoutingModule,
    Page
  ]
})
export class PermissionModule { }

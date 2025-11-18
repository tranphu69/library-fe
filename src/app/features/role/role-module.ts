import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './page/page';
import { SharedModule } from '../../shared/shared.module';
import { RoleRoutingModule } from './role-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RoleRoutingModule,
    Page
  ]
})
export class RoleModule { }

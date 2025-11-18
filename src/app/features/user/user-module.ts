import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './page/page';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    Page
  ]
})
export class UserModule { }

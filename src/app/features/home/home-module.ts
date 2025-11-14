import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './page/page';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    Page
  ]
})
export class HomeModule { }

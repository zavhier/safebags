import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrimValueDirective } from '../directivas/trim-value.directive'



@NgModule({
  declarations: [TrimValueDirective],
  imports: [
    CommonModule
  ],
  exports:[
  TrimValueDirective
  ]
})
export class ShareModule { }

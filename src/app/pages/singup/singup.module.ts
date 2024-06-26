import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SingupPageRoutingModule } from './singup-routing.module';
import { SingupPage } from './singup.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingupPageRoutingModule,
    ReactiveFormsModule,
    ShareModule
  ],
  declarations: [SingupPage ]
})
export class SingupPageModule {}

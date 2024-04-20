import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductoPageRoutingModule } from './producto-routing.module';
import { ProductoPage } from './producto.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoPageRoutingModule,
    ReactiveFormsModule,
    ShareModule
  ],
  providers:[
    BarcodeScanner
  ],
  declarations: [ProductoPage],
})
export class ProductoPageModule {}

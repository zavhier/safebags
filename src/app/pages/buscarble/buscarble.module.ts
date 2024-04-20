import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarblePageRoutingModule } from './buscarble-routing.module';

import { BuscarblePage } from './buscarble.page';
import { BLE } from '@ionic-native/ble/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarblePageRoutingModule
  ],
  providers:[
    BLE
  ],
  declarations: [BuscarblePage]
})
export class BuscarblePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapsPageRoutingModule } from './maps-routing.module';
import { MapsPage } from './maps.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { BLE } from '@ionic-native/ble/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsPageRoutingModule
  ],
  providers:[
    Geolocation,
    NativeGeocoder,
    GoogleMaps,
    BLE
  ],
  declarations: [MapsPage]
})
export class MapsPageModule {}

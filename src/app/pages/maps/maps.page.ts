import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsMapTypeId,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import { GmapsServiceService } from 'src/app/service/gmaps-service.service';
import { Ble } from 'src/app/models/ble.model';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/service/producto.service';
import { EstadosBlueEmun } from 'src/app/emuns/estadoblu.emun';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  _buscando:string='Buscando ...'
  googleMaps:any;
  map: any;
  loading:boolean= true;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  direccion: string="Prueba";
  markers: any[] = [];
  mapClickListener: any;
  markerClickListener: any;
  pairedList: Ble[] = [];;
  listToggle: boolean = false;
  pairedDeviceId: number = 0;
  dataSend = "";
  isToastOpen = false;
  isToastActivarBle = false;
  message:any;
  paso:boolean = false;
  idUsuario:any
  mostrarMap:boolean = false;
  private scanSubscription: Subscription;
  scanSubscriptionBol:Boolean = true;
  devices: any[] = []; // Esta será tu lista de dispositivos encontrados
  productos: Producto [] = []; // Esta será tu lista de dispositivos encontrados
  producto : Producto = new Producto();
  serial:any;
  estado:number;
  estadoData:string;
  urlIcono:string='assets/images/location-pin.png';
  constructor( private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder , private gmaps:GmapsServiceService, 
               private renderer: Renderer2,  private alertController:AlertController,  private activaRouter:ActivatedRoute,
               private router:Router, private productoService:ProductoService,
               private storage:Storage) { }
 
  async ngOnInit() {
    this.activaRouter.paramMap.subscribe(params => {
      this.serial = params.get('id');
         this.buscarEstado();
         this.loading = true; 
         this.idUsuario =  this.storage.get('id');
         this.scanSubscriptionBol= true;
         this.getCurrentCoordinates();
         this.mostrarMap =false;
    });

  }
  options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };






getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp:any) => {
     this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(this.latitude + " " +  this.longitude)
      this.loadMap();
     }).catch((error:any) => {
       console.log('Error getting location', error);
     });
  }

  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };

  // get address using coordinates
  getAddress(lat: any, long: any) {
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
      .then((res: NativeGeocoderResult[]) => {
        this.direccion = this.pretifyAddress(res[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }
  // address
  pretifyAddress(address: any) {
    let obj = [];
    let data = '';
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length) data += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }



 
  async loadMap() {
    try {
      setInterval(() => {
         this.loading = false;
         this.mostrarMap = true;
       }, 1000);
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.latitude, this.longitude);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 18,
        styles: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#212121"
          }]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#212121"
          }]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "color": "#757575"
          }]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#181818"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1b1b1b"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#2c2c2c"
          }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8a8a8a"
          }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#373737"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3c3c3c"
          }]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#4e4e4e"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#000000"
          }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3d3d3d"
          }]
        }
      ]
      });
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker();
      this._buscando = 'SafeBags'
    } catch(e) {
      console.log(e);
    }
  }
 
  addMarker() {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: this.urlIcono,
      scaledSize: new googleMaps.Size(50, 50), 
    };
    const location = new googleMaps.LatLng(this.latitude, this.longitude);
    const marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      // draggable: true,
      animation: googleMaps.Animation.DROP
    });

    marker.addListener('click', () => {
      console.log('Se hizo clic en el marcador');
    });

    const infoWindow = new googleMaps.InfoWindow({
      content: '<div style=color:black;margin-right:14px;><strong>Estado:</strong>'+ this.estadoData +'</div>'
    });
    infoWindow.open(this.map, marker);
    this.markers.push(marker);
      
 }
  
  


    
  async presentAlertError() {
    const alert = await this.alertController.create({
      header: 'el usuario es vacio ',
      subHeader: 'A Sub Header Is Optional',
      message: this.message,
      buttons: ['Action'],
    });

    await alert.present();
  }

  

 
  volver(){
    this.router.navigate(['/profile']);
  }
  
 
  onSalir(){
    this.loading= false;
    this.router.navigate(["/profile"]);
  }


// Función para crear un retraso usando promesas
delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
buscarEstado(){
    this.productoService.getProductoBySerial(this.serial).subscribe(resp=>{
      if(resp.estado == 200){
        this.estado = resp.data[0].tipo_estado_id;
        if(this.estado == EstadosBlueEmun.ACTIVO){
            this.urlIcono= 'assets/images/location-pin.png';
            this.estadoData = 'Activo'
        }else{
            this.urlIcono= 'assets/images/location-pin-perdido.png';
            this.estadoData = 'Extraviado'
        }
      }
    })
 }
  

}

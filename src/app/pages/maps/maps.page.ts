import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/service/producto.service';
import { EstadosBlueEmun } from 'src/app/emuns/estadoblu.emun';


declare var cordova: any;
import { Platform } from '@ionic/angular';
import { Email } from 'src/app/models/email.model';
import { EmailService } from 'src/app/service/email.service';
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
  productos: Producto [] = []; // Esta será tu lista de dispositivos encontrados
  producto : Producto = new Producto();
  serial:any;
  estado:number;
  estadoData:string;
  iosTasoNoPermisos:boolean = false;
  email:Email  =  new  Email();
  urlIcono:string='assets/images/location-pin.png';
  device : Producto = new Producto();
  ioTostEnvioMal:boolean = false;
  ioTostEnvioMalError:boolean = false;
  prod:Producto = new Producto();

  constructor( private geolocation: Geolocation, 
               private nativeGeocoder: NativeGeocoder,
               private gmaps:GmapsServiceService, 
               private renderer: Renderer2,  
               private router:Router,
               private productoService:ProductoService,
               private platform: Platform,
               private activaRouter:ActivatedRoute,
               private storage:Storage,
               private emailService :EmailService,
               private  alertController:AlertController) {
          
  }
 
  async ngOnInit() {
   
   this.requestPermission(); 
   this.activaRouter.paramMap.subscribe(params => {
         let  srl = params.get('id');
         this.buscarEstado(srl);
         this.loading = true; 
         this.idUsuario =  this.storage.get('id');
         this.scanSubscriptionBol= true;
         //this.getCurrentCoordinates()
         this.mostrarMap =false;
    });
    
    this.storage.get('ble').then(prods  => {
         this.productos = prods;
        if (this.productos) {
            this.notificarProductoEncontrados(); // Enviar correo después de obtener los productos y mostrar el mapa
        } 
    })
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
       }, 500);
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

      this.loading = false;
      this.mostrarMap = true;

      
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
       this.presentAlert();
    });

    const infoWindow = new googleMaps.InfoWindow({
      content: '<div style=color:black;margin-right:14px;><strong>Estado:</strong>'+ this.estadoData +'</div>'
    });
    infoWindow.open(this.map, marker);
    this.markers.push(marker);
      
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
buscarEstado(srl:any){
    this.productoService.getProductoBySerial(srl).subscribe(resp=>{
      if(resp.estado == 200){
        this.estado = resp.data[0].tipo_estado_id;
        this.prod = resp.data[0];
        this.loading = false;
        if(this.estado == EstadosBlueEmun.ACTIVO){
            this.urlIcono= 'assets/images/location-pin.png';
            this.estadoData = 'Activo'
        }else{
            this.urlIcono= 'assets/images/location-pin-perdido.png';
            this.estadoData = 'Extraviado'
        }
        this.getCurrentCoordinates();
      }
    })
 }
   

requestPermission() {
      const permission = cordova.plugins.permissions.ACCESS_FINE_LOCATION;
      if (cordova.plugins.permissions) {
            cordova.plugins.permissions.requestPermission(permission, (status:any) => {
              if (status.hasPermission) {
                this.getCurrentCoordinates();
              } else {
                console.warn('Permiso denegado');
              }
            }, (error:any) => {
              console.error('Error al solicitar permiso:', error);
            
            });
      } else {
        console.error("El plugin 'cordova-plugin-android-permissions' no está disponible.");
      }
    }

    /**
  * Funcion para informar en backgroud los productos encontrados que no 
  * son de la propiedad del usuario pero estan perdidos
  */
  notificarProductoEncontrados(){
    this.productos.forEach(e=>{
        if(e.tipo_estado_id  == EstadosBlueEmun.PERDIDO){
           // si esta perdido enviar un email 
           this.email.asunto = "Hola!, te estamos buscando";
           this.email.correo =  e.email;
           this.email.nombre =  e.nombre_cliente;
           this.email.tipoenvio  = "2" ;
           this.email.mensaje = 'Alguien realizó una lectura de Ble';
           this.email.link = 'https://www.google.com/maps?q=' +this.latitude +"," +this.longitude +"&z=22";
           this.enviarMail();
           
        }
        
    })

 }
 enviarMail(){
  this.emailService.send(this.email).subscribe(resp=>{
          console.log('Enviar mapa')
  },(error:any)=>{
      
  })
  }

  async presentAlert() {
    this.message =  this.prod.serial + '\n' + (this.prod.tipo_estado_id == 2 ?'ACTIVO' : 'EXTRAVIADO')
    const alert = await this.alertController.create({
      header:  this.prod.descripcion,
      subHeader: '',
      message: this.message,
      buttons: [
        {
            text: 'Volver',
            handler: () => {
          
            }
        },
    ]
    });
    await alert.present();
  }
}

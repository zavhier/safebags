import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Ble } from 'src/app/models/ble.model';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/service/producto.service';

@Component({
  selector: 'app-buscarble',
  templateUrl: './buscarble.page.html',
  styleUrls: ['./buscarble.page.scss'],
})
export class BuscarblePage implements OnInit {
  loading:boolean = true;
  idUsuario:any
  private scanSubscription: Subscription;
  scanSubscriptionBol:Boolean = true;
  message:any;
  _buscando:string='Buscando ...'
  devices: any[] = []; // Esta será tu lista de dispositivos encontrados
  device: any;
  productos: Producto [] = []; // Esta será tu lista de dispositivos encontrados
  producto : Producto = new Producto();
  bleDevice:Ble = new Ble();
  bleDevices: any[] = [];
  constructor( private alertController:AlertController, private ble: BLE, private router:Router, private productoService:ProductoService,private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loading = true; 
    this.scanSubscriptionBol= true;
    this.searchBluetoothDevicesScan();
  }

  ionViewWillEnter() {
    this.scanSubscriptionBol= true;
    this.searchBluetoothDevicesScan();
    this.loading = true;
  }

  buscar(){
    this.searchBluetoothDevicesScan()
  }
  volver(){
    this.stopScanVolver();
    this.router.navigate(['/profile']);
  }
  
  async searchBluetoothDevicesScan() {
    this.loading = true;
    // Inicializa la lista de dispositivos
    this.bleDevices = [];

    // Inicia la búsqueda de dispositivos durante 10 segundos
    this.scanSubscription = this.ble.scan([], 15).subscribe(
        (device) => {
            // Se encontró un dispositivo, lo agrega a la lista de dispositivos
            device.rssi = device.rssi || 'N/A'; // Si no hay RSSI, muestra 'N/A
            this.bleDevices.push(device);
        },
        (error) => {
            // Maneja cualquier error que ocurra al buscar dispositivos BLE
            this.message = error;
            console.error('Error al buscar dispositivos BLE:', error);
        }
    );

    // Espera 15 segundos antes de detener la búsqueda
    await this.delay(15000);

    // Detiene la búsqueda después de 15 segundos
   this.scanSubscription.unsubscribe();

    // Actualiza el estado de carga
    this.loading = false;

    // Verifica si se encontraron dispositivos
    if (this.bleDevices.length === 0 && this.scanSubscriptionBol) {
        this.presentAlertRetry();
    }
    else{
      this.buscarDispositivosEnBase()
    }
}

/**Lectura de códigos 
 * I6 es el chiquito cuadrado
 * F6 El ios
 */
  onBuscar(){
    this.searchBluetoothDevicesScan();
  }
  onSalir(){
    this.loading= false;
    this.stopScanVolver();
    this.router.navigate(["/profile"]);
  }

  stopScanVolver() {
    // Detiene la búsqueda manualmente al hacer clic en el botón
    this.scanSubscriptionBol = false;
    if (this.scanSubscription) {
        this.scanSubscription.unsubscribe();
    }
   // Actualiza el estado de carga
    this.loading = false;
     this.devices = [];
}


// Función para crear un retraso usando promesas
delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  async presentAlertRetry() {   
    const alert = await this.alertController.create({
        header: 'No se encontraron dispositivos',
        message: '¿Desea intentar buscar nuevamente?',
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
                    this.volver();
                }
            },
            {
                text: 'Buscar nuevamente',
                handler: () => {
                    // Inicia una nueva búsqueda
                    this.searchBluetoothDevicesScan();
                }
            }
        ]
    });

    await alert.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: '!Ups¡, no hay un dispositivo cerca ',
      subHeader: '',
      message: this.message,
      buttons: [
        {
            text: 'Volver',
            handler: () => {
                // Llamar a la primera función aquí
                this.volver();
            }
        },
        {
            text: 'Buscar',
            handler: () => {
                // Llamar a la segunda función aquí
                this.buscar();
            }
        }
    ]
    });
    await alert.present();
  }

  onBuscarDevice(item: any){
    this.stopScanVolver();
    this.router.navigate(['/maps', item.serial]);
  }

  buscarDispositivosEnBase(){
    this.productos = [];
    this.bleDevices.forEach(e=>{
        let prod   = e.id.replaceAll(":","");
        let spl =  prod.substring(0,4);
        if(spl == "AC23"){//AC23 es la configuracion del fabricante   
              this.producto = new Producto();
              this.producto.serial = prod;
              this.producto.tipo_estado_id = 2;
              this.producto.rssi = e.rssi
              this.productos.push(this.producto);
            /* this.productoService.getProductoBySerial(prod).subscribe(resp=>{
                  if(resp.estado == 200){
                      this.producto = new Producto();
                      this.producto.serial =  prod;
                      this.producto.id = resp.data[0].id;
                      this.producto.razon_social_id = resp.data[0].razon_social_id;
                      this.producto.condicion = 1;
                      this.producto.serial = resp.data[0].serial
                      this.producto.tipo_estado_id = resp.data[0].tipo_estado_id;
                      this.productos.push(this.producto);
                      this.loading = false;
                      this._buscando = 'Dispositivos encontrados'
                  }
             })*/
        }
    })

  }
  

}

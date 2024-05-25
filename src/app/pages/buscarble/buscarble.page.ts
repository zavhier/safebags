import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { AlertController } from '@ionic/angular';
import { Observable, Subscription, forkJoin, map } from 'rxjs';
import { Ble } from 'src/app/models/ble.model';
import { Email } from 'src/app/models/email.model';
import { Producto } from 'src/app/models/producto.model';
import { EmailService } from 'src/app/service/email.service';
import { ProductoService } from 'src/app/service/producto.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-buscarble',
  templateUrl: './buscarble.page.html',
  styleUrls: ['./buscarble.page.scss'],
})
export class BuscarblePage implements OnInit {
  loading:boolean = false;
  idUsuario:any
  private scanSubscription: Subscription;
  scanSubscriptionBol:Boolean = true;
  message:any;
  _buscando:string='Buscando ...'
  devices: any[] = []; // Esta será tu lista de dispositivos encontrados
  device: any;
  productos: Producto [] = []; // Esta será tu lista de dispositivos encontrados
  productosPerdidos: Producto [] = []; 
  producto : Producto = new Producto();
  bleDevice:Ble = new Ble();
  bleDevices: any[] = [];
  email:Email = new Email();
  fechaHoy: Date = new Date();
  isToastOpen:boolean = false;
  prods:Producto []  = [];
  _buscar:boolean = true;
  constructor( private alertController:AlertController, private ble: BLE, private router:Router, 
              private productoService:ProductoService,private changeDetectorRef: ChangeDetectorRef,
              private activiteRouter:ActivatedRoute, private emailService:EmailService, private storage:Storage,private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.idUsuario = this.activiteRouter.snapshot.paramMap.get('id');
    this.loading = true; 
    this.scanSubscriptionBol= true;
    this._buscar = true;
    this.searchBluetoothDevicesScan()
    this.productosPerdidos = [];
    this.productos = [];

  }

  ionViewWillEnter() {
    this._buscar = true;
    this.productosPerdidos = [];
    this.productos = [];
    this.searchBluetoothDevicesScan();
    this.loading = true; 
    this.scanSubscriptionBol= true;
  }

  buscar(){
    this.searchBluetoothDevicesScan()
  }
  volver(){
    this.stopScanVolver();
    this.router.navigate(['/profile']);
  }
  
 /* async searchBluetoothDevicesScan() {
    this.loading = true;
    this.bleDevices = [];
    this.scanSubscription = this.ble.scan([], 15).subscribe(
        (device) => {
            device.rssi = device.rssi || 'N/A'; // Si no hay RSSI, muestra 'N/A
            this.bleDevices.push(device);
            this.buscarDispositivosEnBase();
        },
        (error) => {
            this.message = error;
            console.error('Error al buscar dispositivos BLE:', error);
        }
    );
    await this.delay(15000);
   this.scanSubscription.unsubscribe();
    if (this.bleDevices.length === 0 && this.scanSubscriptionBol) {
        this.presentAlertRetry();
    }
    else{
      this.buscarDispositivosEnBase()
    }
}
*/
async searchBluetoothDevicesScan() {
  this.loading = true;
  this.bleDevices = [];
  this.scanSubscription = this.ble.scan([],60).subscribe(
      (device) => {
          let prod = device.id.replaceAll(":", "");
          let spl = prod.substring(0, 4);
          if (spl == "AC23") {
            this.bleDevices.push(device);
            this.updateUI();  
            this.buscarDispositivoEnBase(prod);
          }
      },
      (error) => {
          // Maneja cualquier error que ocurra al buscar dispositivos BLE
          this.message = error;
          console.error('Error al buscar dispositivos BLE:', error);
      }
  );

  setTimeout(() => {
    this._buscar = false;  
    console.log('El escaneo de dispositivos BLE ha finalizado.');
  }, 60000);
}


  onBuscar(){
    this.searchBluetoothDevicesScan();
  }
  onSalir(){
    this.productosPerdidos = [];
    this.productos = [];
    this.loading= true;
    this.stopScanVolver();
    this.router.navigate(["/profile"]);
  }

  stopScanVolver() {
    this.productos =  [];
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
            text: 'Salir',
            handler: () => {
                // Llamar a la primera función aquí
            }
        },
       
    ]
    });
    await alert.present();
  }

  onBuscarDevice(item: any){
    this.productos =  [];
    this.stopScanVolver();
    this.router.navigate(['/maps', item.serial]);
  }

  /**
   * Para los productos que no son del cliente pero el estado es perdido 
   * enviar un email con las coordenas 
   * con el tipo envio = 2
   * SUBJECT_SAFEBAGS = 'Notificación de dispositivo encontrado.' Mandalo con tipo de email (4)
   * 
   */
  buscarDispositivosEnBase() {
    this.productos = [];
    const observables: Observable<any>[] = [];

    this.bleDevices.forEach(e => {
        let prod = e.id.replaceAll(":", "");
        let spl = prod.substring(0, 4);
        if (spl == "AC23") {
            observables.push(this.productoService.getProductoBySerial(prod).pipe(
                map(resp => ({ resp, e })) // Combina la respuesta con 'e' para acceder a 'e' más tarde
            ));
        }
    });

    forkJoin(observables).subscribe(results => {
        results.forEach(({ resp, e }) => { // Desestructura el resultado para acceder a 'resp' y 'e'
            if (resp.estado == 200) {
                let producto = new Producto();
                producto.serial = resp.data[0].serial;
                producto.id = resp.data[0].id;
                producto.razon_social_id = resp.data[0].razon_social_id;
                producto.condicion = 1;
                producto.tipo_estado_id = resp.data[0].tipo_estado_id;
                producto.rssi = e.rssi; 
                producto.email = resp.data[0].email;
                producto.nombre_cliente = resp.data[0].nombre;
                producto.descripcion = resp.data[0].descripcion;
                if (this.idUsuario == resp.data[0].usuario_id) {
                    this.productos.push(producto);
                    this.updateUI();
                    this.loading = false;
                } else {
                    this.productosPerdidos.push(producto);
                }
            }
        });
        this.loading = false;
        this._buscando = 'Dispositivos encontrados';
        this.storage.set('ble', this.productosPerdidos);
    });
  }

  buscarDispositivoEnBase(prod: any) {
        this.productoService.getProductoBySerial(prod).subscribe(resp => {
            if (resp.estado == 200) {
                let producto = new Producto();
                producto.serial = resp.data[0].serial;
                producto.id = resp.data[0].id;
                producto.razon_social_id = resp.data[0].razon_social_id;
                producto.condicion = 1;
                producto.tipo_estado_id = resp.data[0].tipo_estado_id;
                //producto.rssi = device.rssi; 
                producto.email = resp.data[0].email;
                producto.nombre_cliente = resp.data[0].nombre;
                producto.descripcion = resp.data[0].descripcion;
                if (this.idUsuario == resp.data[0].usuario_id) {
                    this.productos.push(producto);
                    this.updateUI();
                } else {
                    this.productosPerdidos.push(producto);
                }
                this.loading = false;
                
            }
        },er=>{
            
        });
   }

  updateUI() {
   this.cdRef.detectChanges(); 
  }
}

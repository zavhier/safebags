import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Producto } from 'src/app/models/producto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ProductoService } from 'src/app/service/producto.service';
import { UserService } from 'src/app/service/user.service';
import {EstadosBlueEmun} from '../../emuns/estadoblu.emun'
import { BLE } from '@ionic-native/ble/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  producto:Producto = new Producto();
  idUsuario:any;
  access_token:any;
  _usuario:Usuario= new Usuario();
  _loading:boolean= true;
  _productos:Producto [] =  [];
  prod:Producto = new Producto();
  _cargarLoading:Boolean = false;
  isToastOpen:boolean = false;
  accionClickTab:boolean = false;
  messagePerdido = '¡Lo perdiste!, tranquilo cambia el estado'
  messageLoEncontro = '¡Lo encontraste!, qué alegria, cambia el estado '
  isToastBle:boolean= false;
  constructor(private route: ActivatedRoute, private userService:UserService,public router:Router,
    private productoService:ProductoService,  private storage:Storage,   
     private nvrCrl:NavController, private loadingPage:LoadingController, private alertController: AlertController, private ble:BLE) { }

  async ngOnInit() {
    debugger;
    this.route.paramMap.subscribe(params => {
      this.idUsuario = params.get('id');
      this.showLoading();
      if (this.idUsuario) {
        this.storage.set('id', this.idUsuario);
      } else {
        this.storage.get('id').then((data: any) => {
          this.idUsuario = data;
        });
      }
      this.storage.get('access_token').then((data): any => {
        this.access_token = data;
        if (this.idUsuario !== "") {
          this.buscarProfileUsuario();
        }
      });
    });
     
  }
  onActualizar(){
     this.onCargarProductos();
  }
  onClickTab(){
    /*  this.accionClickTab = !this.accionClickTab;
       if(this.accionClickTab)
            this.onCargarProductos()
      */
      
  }
  
  buscarProfileUsuario(){
    this.storage.get('access_token').then(token => {
      this.userService.get(this.idUsuario, token).subscribe(resp=>{
        this._usuario = resp.data[0];
        this.onCargarProductos();
        this._loading = false;
    }, (err)=>{
        console.log('Error');
    })
    }); 
 }

 onCargarProductos(){
   this.productoService.getAllByUsuario(this.idUsuario, this.access_token).subscribe(resp=>{
      this._productos = []
      this._productos = resp.data;
      console.log('Sus productos son: ' , resp);
  })
}
  
 onSalir(){
  this.nvrCrl.navigateBack('/login')
 }

 /**Buscar dispositivo **/
 onSearch(serial:String){
     this.router.navigate(['/maps', serial]);
 }
 onNuevo(){
   this.router.navigate(['/producto', this.idUsuario]);
 }

 async showLoading() {
  const loading = await this.loadingPage.create({
    message: 'Cargando información ...',
    duration: 500,
  });
    loading.present();
  }
 

  onChange(item:Producto){
    let message = '';
    this.prod = item;
       if(item.tipo_estado_id == EstadosBlueEmun.ACTIVO){
           message = this.messagePerdido;
       }else {
          message = this.messageLoEncontro;
       }
       this.presentAlert(message);
  }

  async presentAlert(message:string) {
    const alert = await this.alertController.create({
      header: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Cambiar',
          role: 'confirm',
          handler: () => {
            this.cambiarEstado();
          },
        },
      ],
    });

    await alert.present();

  
  }

  /** 
   * Cambiar estado 
   * **/
  cambiarEstado(){
    this.isToastOpen= false;
    let estado = this.prod.tipo_estado_id == EstadosBlueEmun.ACTIVO ? EstadosBlueEmun.PERDIDO : EstadosBlueEmun.ACTIVO
    debugger;
    this.productoService.updateProductEstado(this.prod.id, estado, this.access_token).subscribe(resp=>{
         if(resp.data.estado == 200){
              this.prod.tipo_estado_id = estado;
              this.isToastOpen= true;
              this._productos.forEach(e=>{
                    if(e.id  == this.prod.id){
                        e.tipo_estado_id = estado;
                    }
              })
         }
    })
  }

  onBuscarbleButtonClick() {
    // Verificar el estado del Bluetooth antes de navegar
    this.ble.isEnabled().then(
      () => {
        // El Bluetooth está habilitado, navegar a la página buscarble
        this.router.navigate(['/buscarble']);
      },
      () => {
        // El Bluetooth está deshabilitado, mostrar el toast
        this.isToastBle = true;
        setTimeout(()=>{
          this.isToastBle = false;
        }, 3000)
      }
    );
  }
}

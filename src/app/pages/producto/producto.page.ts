import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner }from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/service/producto.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  formGroup:FormGroup
  idUsuario:any;
  message:any
  _producto:Producto = new Producto();
  access_token:any;
  _loading:boolean = false;
  isToastOpen:boolean = false;
  isToastDatosRequeridos:boolean = false;
  @ViewChild('miFormulario') miFormulario!: NgForm; 
  isToastBle :boolean = false;
  productoUtilizado = false;
  constructor(private activiteRouter:ActivatedRoute,
      private barcodeScanner: BarcodeScanner,
      private _productoService:ProductoService,private storage:Storage,private router:Router, private formBuilder:FormBuilder) {
        this.formGroup = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(4)]],
          descripcion: ['', [Validators.required, Validators.minLength(4)]],
          serial: ['', [Validators.required, Validators.minLength(4)]],
        })
   }

   async  ngOnInit() {
    this.idUsuario = this.activiteRouter.snapshot.paramMap.get('id');
    this.storage.set('id' , this.idUsuario);
    this.access_token =  await this.storage.get('access_token')
    this._producto.fecha_creacion = new Date()

   

  }

/*
  onGuardar(){
    if (this.miFormulario && this.miFormulario.valid) {
       this._loading = true,
       this._producto.usuario_id = this.idUsuario;
       this._producto.tipo_estado_id = 2;
       this._producto.url_qr=environment.host +"/buscar/"+  this.formGroup.value['serial'];
       this._producto.codigo_qr= this._producto.serial;
       this._producto.urlimg = "-";
       this._producto.condicion = environment.razon_social;
       this._producto.nombre = this.formGroup.value['nombre'];
       this._producto.descripcion= this.formGroup.value['descripcion'];
       this._producto.fecha_creacion=  new Date();

       this._productoService.save(this._producto,this.access_token).subscribe(resp=>{
              setTimeout(() => {
                this._loading = false;
                this.router.navigate(["/profile", this.idUsuario]);
              }, 4000); 
            },
            
            )
    } else {
      this.isToastDatosRequeridos = true;
      setTimeout(()=>{
         this.isToastDatosRequeridos = false;
      }, 5000)
       return console.log('Please provide all the required values!');
    }
  }
*/

  
  submitForm = () => {
    debugger;
    if (this.formGroup && this.formGroup.valid && !this.productoUtilizado ){
        this._loading = true,
        this._producto.usuario_id = this.idUsuario;
        this._producto.tipo_estado_id = 2;
        this._producto.url_qr=environment.host +"/buscar/"+  this.formGroup.value['serial'];
        this._producto.codigo_qr= this._producto.serial;
        this._producto.urlimg = "-";
        this._producto.condicion = environment.razon_social;
        this._producto.nombre = this.formGroup.value['nombre'];
        this._producto.descripcion= this.formGroup.value['descripcion'];
        this._producto.fecha_creacion=  new Date();

        this._productoService.save(this._producto,this.access_token).subscribe(resp=>{
              setTimeout(() => {
                this._loading = false;
                this.router.navigate(["/profile", this.idUsuario]);
              }, 4000); // Retraso de 1 segundo (1000 milisegundos)
            },
            )
    } else {
       this.isToastDatosRequeridos = true;
      setTimeout(()=>{
          this.isToastDatosRequeridos = false;
       }, 5000)
        return console.log('Please provide all the required values!');
    }
  };

  onSalir(){
       this.router.navigate(['/profile', this.idUsuario]);
  }
  onScanner(){
      this.barcodeScanner.scan().then(barcodeData => {
        this.message = barcodeData.text
        this._producto.serial = this.message;  
        this.formGroup.controls['serial'].setValue(this.message);   
        this.validarCodigoBle();
        }).catch(err => {
           console.log('Error', err);
           this.message = err;
         
        });
  }

  onActualizar(){

  }

  validarCodigoBle(){
       this._productoService.getProductoBySerial(this.message).subscribe(r=>{
            if(r.estado == 200){
                this.isToastBle  =  true;
                this.productoUtilizado = true
                setTimeout(() => {
                    this.isToastBle = false;
                }, 2000);
            }
       })
  }

}

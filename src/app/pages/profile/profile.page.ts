import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/service/producto.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  producto:Producto = new Producto();
  idUsuario:any;
  access_token:any;
  constructor(private route: ActivatedRoute, private userService:UserService,
    private productoService:ProductoService, private storage:Storage) { }

    async ngOnInit() {
     this.idUsuario = this.route.snapshot.paramMap.get('id');
     this. access_token =  await this.storage.get('access_token')
     if(this.idUsuario != ""){
           this.buscarProfileUsuario();
     }
  }
  buscarProfileUsuario(){
       this.userService.get(this.idUsuario, this.access_token).subscribe(resp=>{
          console.log('hola que tal ' , resp);
       })
 }

  onSave(){
   this.producto.descripcion="La guitarra de lolo";
   this.producto.nombre='dispositivo blue'
   this.producto.usuario_id = this.idUsuario;
   this.productoService.save(this.producto,this.
      access_token).subscribe(resp=>{
      console.log('pito corto ' , resp);
   })
 }


}

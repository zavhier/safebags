import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from 'src/app/models/usuario.model';
import {FormBuilder,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
   
   fromLogin:FormGroup;
   email:any;
   password:any;
   isToastOpen = false;
   _type:string = 'Password'
   _usuario:Usuario = new Usuario();
   access_token:any;
   _sppiner:boolean = false;
   isToastDatosRequeridos:boolean= false;
  constructor(private _userService:UserService, public navCtrl:NavController, public router:Router,
      private storage:Storage,private fromBuilder:FormBuilder) {
         this.fromLogin  = this.fromBuilder.group({
            password:['',Validators.required],
            email: [
              '',
              [
                Validators.required,
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
            
              ],
            ],
         })

   }

   async ngOnInit() {
    this.isToastOpen = false;
    this.email= "";
    this.password= "";
    this._sppiner = false;
    await this.storage.create();
  }

  onLogin(){
    this._sppiner = true;
    this._userService.login(this.email,this.password).subscribe(resp=>{
       if(resp.data.estado != '200'){
            this.isToastOpen = true;
            this._sppiner = false;
            setTimeout(() => {
               this.isToastOpen = false;
             }, 5000); 
       }else{
          let id = resp.data.idusuario
          this.storage.set('access_token', resp.data.access_token);
          this.router.navigate(['/profile', id]);
          this._sppiner = false;
       }
     
     })
  }
  onSinup(){
     this.navCtrl.navigateForward('singup')
  }
  onRecuperarUsuario(){
     this.navCtrl.navigateForward('forgotpassword')
  }
  togglePasswordMode(input: any){
      input.type = input.type === 'password' ?  'text' : 'password';
  }


  submitForm = () => {
   if (this.fromLogin.valid) {
        debugger
         this.password = this.fromLogin.value['password'];
         this.email  =  this.fromLogin.value['email'];
         this.onLogin();
   } else {
      this.isToastDatosRequeridos = true;
     setTimeout(()=>{
         this.isToastDatosRequeridos = false;
      }, 5000)
       return console.log('Please provide all the required values!');
   }
 };
  
}

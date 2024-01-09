import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
   
   email:string="";
   password:string="";
   isToastOpen = false;
   _type:string = 'Password'
  constructor(private _userService:UserService, public navCtrl:NavController, public router:Router, private storage:Storage) {

   }

   async ngOnInit() {
    this.isToastOpen = false;
    await this.storage.create();
  }

  onLogin(){
    this._userService.login(this.email,this.password).subscribe(resp=>{
       if(resp.data.estado == '401'){
            this.isToastOpen = true;
       }else{
          let id = resp.data.idusuario
          debugger;
          this.storage.set('access_token', resp.data.access_token);
          this.router.navigate(['/profile', id]);
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
  
}

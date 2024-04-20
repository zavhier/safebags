import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/service/email.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  formForgetPassword:FormGroup;
  isToastOpen:boolean= false;
  isToastOpenOk:boolean= false;
  isToastErrorMail:boolean= false;
  _cambio:boolean = false
  constructor(public formBuilder:FormBuilder, private  userService:UserService, private router:Router) { }

  ngOnInit() {
    this.isToastOpen = false
     this.formForgetPassword = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],

     })
  }

  get errorControl() {
    return this.formForgetPassword.controls;
  }

  ionViewWillEnter() {
     this.formForgetPassword.reset();
  }
  submitForm = () => {
    if (this.formForgetPassword.valid) {
        return false;
   
    } else {
       this.isToastOpen = true;
        return console.log('Please provide all the required values!');
    }
  };
  submit(){
    let email = this.formForgetPassword.value['email'];
    this.userService.forgotPassword(email).subscribe(resp=>{

        
    })
  }

  onVolver(){
     this.router.navigate(["/login"])
  }

  onRecuperarUsuarioSubmit = () => {
    if (this.formForgetPassword.valid) {
       let correo =  this.formForgetPassword.value['email'];
       this.userService.recuperarUsuario(correo).subscribe(resp=>{
          if(resp.data.estado == 200){
            this.formForgetPassword.reset();
            this.isToastOpenOk = true;
            setTimeout(() => {
                 this.isToastOpenOk = false;
            },  3000);
          }else{
            this.isToastErrorMail = true;
            setTimeout(() => {
                 this.isToastErrorMail = false;
            },  3000);
          }
   
       },(e)=>{
           
       })
       
    } else {
       this.isToastOpen = true;
       setTimeout(() => {
            this.isToastOpen = false;
       },  3000);
        
    }
  };

}



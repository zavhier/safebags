import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Email } from 'src/app/models/email.model';
import { Usuario } from 'src/app/models/usuario.model';
import { EmailService } from 'src/app/service/email.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  ionicForm: FormGroup;
  isToastOpen = false;
  usuario:Usuario= new Usuario();
  isToastOpenError:boolean = false;
  isToastOpenSuccess:boolean = false
  _loading:boolean = false;
  _exito:boolean = false;
  _usuario:string= '';
  email:Email= new Email();
  isToastOpenMail:boolean = false
  emailRep = false;
  constructor(private nvrCtl:NavController, public formBuilder:FormBuilder, public usuerService:UserService, private emailService:EmailService ) { }
  ngOnInit() {
    this.emailRep = false;
    this.isToastOpen = false;
    this.ionicForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      password:['',Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      telcel: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }


  onVolver(){
    this.nvrCtl.navigateBack('');
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  submitForm = () => {
     if(!this.emailRep){
      if (this.ionicForm.valid) {
            this.emailRep = false;
            this._loading = true;
            this.usuario.nombre = this.ionicForm.value['nombre'] + " " + this.ionicForm.value['apellido'] ;
            this._usuario = this.usuario.nombre;
            this.usuario.email = this.ionicForm.value['email'];
            this.usuario.password = this.ionicForm.value['password'];
            this.usuario.estado = 1;
            this.usuario.genero = 'X';
            this.usuario.telcel = this.ionicForm.value['telcel'];
            this.usuario.telref = this.usuario.telcel
            this.email.asunto = '¡Genial!, Ya casi sos parte de Safebags';
            this.email.correo = this.usuario.email;
            this.email.nombre = this.usuario.nombre;
            this.email.tipoenvio  = '3'
            this.email.mensaje ="¡Genial!; Ya casi sos parte de safebags, solo falta sincronizar el ble',"
            this.usuerService.save(this.usuario).subscribe(resp=>{    
            if(resp.estado == '200'){
                  this.envioMail();
                  setTimeout(()=>{
                  },5000)
                      this._loading = false;
                      this._exito = true;
                      this.isToastOpenSuccess = true;
                  }else{
                      this.isToastOpenError = true;
                      this.nvrCtl.navigateBack("login");
                  }
            })
            return false;
   
    } else {
       this.isToastOpen = true;
       setTimeout(()=>{
          this.isToastOpen = false;
       }, 5000)
        return console.log('Please provide all the required values!');
    } 
    }else{
      this.isToastOpenMail = true;
      setTimeout(()=>{
        this.isToastOpenMail = false;
     }, 5000)
    }
    
  };

  envioMail(){
    this.emailService.send(this.email).subscribe(resp=>{console.log('envio de email')});
  }

  onValidarUsuario(){
     this.isToastOpenMail = false;
     let  email = this.ionicForm.value['email'];
     email = email.trim();
     if(email != ''){
          this.usuerService.getValidarExisteUsuario(email).subscribe(resp=>{
            debugger;
             if(resp.data[0].existe === 1){
                  this.emailRep = true;
                  this.isToastOpenMail = true;
                  setTimeout(()=>{
                    this.isToastOpenMail = false;
                 }, 5000)
             }else{
              this.emailRep = false;
             }
          })
     }
  
}

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
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
  constructor(private nvrCtl:NavController, public formBuilder:FormBuilder, public usuerService:UserService ) { }
  ngOnInit() {
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
      telcel: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telref: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }


  onVolver(){
    this.nvrCtl.navigateBack('');
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  submitForm = () => {
    if (this.ionicForm.valid) {
        this.usuario.nombre = this.ionicForm.value['nombre'];
        this.usuario.email = this.ionicForm.value['email'];
        this.usuario.password = this.ionicForm.value['password'];
       // this.usuario.fecha = new Date();
        this.usuario.estado = 1;
        this.usuario.genero = 'M';
        this.usuario.telcel = this.ionicForm.value['telcel'];
        this.usuario.telref = this.ionicForm.value['telref'];
        this.usuerService.save(this.usuario).subscribe(resp=>{
              if(resp.estado != '404'){
                  this.isToastOpenSuccess = true;
              }else{
                this.isToastOpenError = true;
                this.nvrCtl.navigateBack("login");
              }
        })
        console.log(this.ionicForm.value);
        return false;
   
    } else {
       this.isToastOpen = true;
        return console.log('Please provide all the required values!');
    }
  };

}

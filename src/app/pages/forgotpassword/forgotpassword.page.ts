import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(public formBuilder:FormBuilder, private  userService:UserService) { }

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

}

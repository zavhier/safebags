import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  constructor(private http:HttpClient) {

  }
  login(username:string, password:string){
        var formData: any = new FormData();
        formData.append('username',username);
        formData.append('password', password);
        formData.append('company',  environment.company)
      return this.http.post(environment.host +'auth', formData).pipe(
       tap((resp:any)=>{
         
        }))
  }
/*
 * @param usuario 
 * @return usuario
 */
  save(usuario:Usuario){
      usuario.rol = environment.rol;
      usuario.idEmpresa = environment.company;
      usuario.urlimg = "-";
      return this.http.post(environment.host + 'user' , usuario).pipe(
          tap((resp:any)=>{
            debugger;
              console.log(resp)             
          },
          (err)=>{
              console.log(err)
          })
      )
  }
 /**
  * @param id 
  * @returns  Usuario
  */
  get(id:any, access_token:string):Observable<any>{
      const headers = { 'Authorization': 'Bearer ' + access_token}
      // var formData:any = new FormData();
      // formData.append('id', id);
      return this.http.get(environment.host + 'userbyid/'+ id , {headers: headers}).pipe(
        tap((resp:any)=>{
            console.log(resp)
        })
      )
  }
  forgotPassword(email:string){
    var formData:any = new FormData();
    return this.http.post(environment.host + "", formData).pipe(
       tap((resp:any)=>{
           
       })
    )
    
  }
}

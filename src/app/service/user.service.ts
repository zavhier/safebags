import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { company } from '../emuns/company.emun';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    _usuario:Usuario = new Usuario();
  
  constructor(private http:HttpClient) {

  }
  login(username:string, password:string){
        var formData: any = new FormData();
        formData.append('username',username);
        formData.append('password', password);
        formData.append('company',  company.SAFEBAGS)
        return this.http.post(environment.host +'auth', formData).pipe(
           tap((resp:any)=>{
              console.log(resp)
          },err=>{
            console.log(err)
          })
        )
  }
/*
 * @param usuario 
 * @return usuario
 */
  save(usuario:Usuario){
      usuario.rol = environment.rol;
      usuario.idempresa = company.SAFEBAGS;
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
      return this.http.get(environment.host+"userbyid/"+id , {headers: headers}).pipe(
        tap((resp:any)=>{
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
  recuperarUsuario(email:string):Observable<any>{
    var formData: any = new FormData();
    formData.append('email',email);
    return this.http.post(environment.host +'recoveruser', {'email': email})
  }

  getValidarExisteUsuario(email:string):Observable<any>{
       return this.http.post(environment.host + 'checkexistsuser', {"email":email, 'idcompania':environment.company})
  }
}

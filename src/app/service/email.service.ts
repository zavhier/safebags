import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Email } from '../models/email.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient) {

   }
   send(email:Email):Observable<any>{
      return  this.http.post(environment.host + "sendmail" , email).pipe(
        tap((resp:any)=>{
          console.log(resp)             
          },
          (err)=>{
              console.log(err)
          })
      )
   }
}

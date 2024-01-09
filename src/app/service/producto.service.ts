import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) {

  }
  save(producto:Producto, access_token:string):Observable<any>{
      const headers = { 'Authorization': 'Bearer ' + access_token}
      return this.http.post(environment.host +'produc' , producto,{ headers: headers})        ;
  }

}

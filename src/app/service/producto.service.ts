import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

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

  getAllByUsuario(usuarioId:any, access_token:string):Observable<any>{
    const headers = { 'Authorization': 'Bearer ' + access_token}
    return this.http.get<any>(environment.host +'producbyuser/'+  usuarioId, {headers: headers}).pipe(
      tap((resp:any)=>{
          resp.data;
      })
    );
  }
  updateProductEstado(id:number, estadoId:number, access_token:any):Observable<any>{
    const headers = { 'Authorization': 'Bearer ' + access_token}
    return this.http.put(environment.host + "producbystate" ,{"id":id, "tipo_estado_id":estadoId},{headers: headers}).pipe(
          tap((resp:any)=>{
            console.log(resp)
        }, err => {
           console.error(err);
       })
    )
  }
  
  getProductoBySerial(serial:string):Observable<any>{
    return this.http.get(environment.host + 'productbyqrserial/' + serial).pipe(
          tap((resp:any)=>{
            console.log(resp)
        }, err => {
            console.error(err);
      })
    )
  }
 
  delete(item:Producto, access_token:any):Observable<any>{
     const headers = { 'Authorization': 'Bearer ' + access_token}
     return this.http.delete(environment.host + 'produc/' + item.id,{headers: headers});
  }

}

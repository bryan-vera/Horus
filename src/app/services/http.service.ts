import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from "@ionic-native/http/ngx";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  dev= '192.168.1.3';
  prod='200.105.245.250';
  ip_server='';
  workingDev=true;
 
  
  
  constructor(public http: HttpClient,
    public httpAD: HTTP) { 
    if (this.workingDev){
      this.ip_server=this.dev;
    } else {
      this.ip_server=this.prod;
    }
  }

  cargarDetalle(claveAcceso: string) {
    return this.http
      .get('http://'+this.ip_server+':8069/Picking/DetalleFactura?ClaveAcceso=' + claveAcceso
        , { responseType: 'json' });
  }

  cargarPicking(claveAcceso: string) {
    return this.http
      .get('http://'+this.ip_server+':8069/Picking/LecturaPicking?ClaveAcceso=' + claveAcceso
        , { responseType: 'json' });
  }

  cargarPickFactura(secuencial: string,empresa: string) {
    return this.http
      .get('http://'+this.ip_server+
      ':8069/Picking/LecturaPickingFactura?Secuencial=' + secuencial +
      '&empresa='+empresa
        , { responseType: 'json' });
  }

  cargarMisFacturas(id_usuario:any){
    return this.http
    .get('http://'+this.ip_server+':8069/Picking/MisFacturas?id_usuario='+id_usuario
    , {responseType: 'json'});
  }

  obtenerPresupuesto(id_usuario:any){
    return this.http
    .get('http://'+this.ip_server+':8069/Visitador/MetaPresupuesto?id_visitador='+id_usuario
    , {responseType: 'json'});
  }

  enviarDatos(idfactura: any,
      codigoEstado:any,
      secuencial:any,
      empresa:any,
      id_usuario:any) {
    // var headers = new Headers();
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };

    let postData = {
      "id_factura": idfactura,
      "codigo_estado": codigoEstado,
      "empresa": empresa,
      "secuencial": secuencial,
      "id_usuario": id_usuario  ,
    }

    return this.http.post('http://'+this.ip_server+':8069/Picking/GrabarDatos', postData
      ,{responseType:'text'});
  }

  enviarDatosGPS(datos) {

  // var headers = new Headers();
  const httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  };

  let postData = {
    "latitud": datos.latitud,
    "longitud": datos.longitud,
    "id_usuario": datos.id_usuario,
    // "fecha_hora": datos.tiempo,
    "indicador_mock": datos.indicador_mock, 
  }

  return this.httpAD.post('http://'+this.ip_server+':8069/Geoubicacion/GrabarUbicacion', postData
    ,{responseType:'text'});
}


  getHeader() {
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'text/javascript'
      })
    };
    return headers;
  }

}


import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject,throwError, from, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'mi-token';
const ID_DEPARTAMENTO = 'id-departamento';
const CODIGO_USUARIO = 'codigoUsuario';
const ROL='roles';
const PERMISOS='permisos';

export interface Usuario {
  idUsuario: number;
  idDepartamento: number;
  token: string;
  rol: string;
  permisos: string[];
  indicador_vendedor: boolean;
}

@Injectable({
  providedIn: 'root'
})  

export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private usuarioActual: BehaviorSubject<any> = new BehaviorSubject(null);
  token='';
  

  constructor(private http: HttpClient,
    private storage: Storage) {
      this.storage.create();
      this.loadToken();
  }

  async loadToken() {
    const token = await this.storage.get(TOKEN_KEY);    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {Username, Password}): Observable<any> {
    let userObj: Usuario;
    return this.http.post(`http://192.168.1.3:8069/Autenticacion/Authenticate`, credentials).pipe(
      map((data: Usuario)=>{
        if(data){
          this.storage.set(ID_DEPARTAMENTO,data.idDepartamento);
          this.storage.set(CODIGO_USUARIO,data.idUsuario);
          this.storage.set(TOKEN_KEY,data.token);
          if(data.indicador_vendedor==true){
            this.storage.set(ROL,'VISITADOR');
            this.storage.set(PERMISOS,['read','write']);
            userObj = {
              idUsuario: data.idUsuario,
              idDepartamento: data.idDepartamento,
              token: data.token,
              rol: 'VISITADOR',
              permisos: ['read','write'],
              indicador_vendedor: true
            };
          } else {
            this.storage.set(ROL,'PICKING');
            this.storage.set(PERMISOS,['read','write']);     
            userObj = {
              idUsuario: data.idUsuario,
              idDepartamento: data.idDepartamento,
              token: data.token,
              rol: 'PICKING',
              permisos: ['read','write'],
              indicador_vendedor: false
            };       
          }
        } else {
          return null;
        }
        return userObj;
      })
      ,
      tap(_ => {
        this.isAuthenticated.next(true);
        this.usuarioActual.next(userObj);
      })
      ,
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          // handle error
        }
        return throwError(error);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.storage.remove(CODIGO_USUARIO);
    this.storage.remove(ID_DEPARTAMENTO);
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(ROL);
    this.storage.remove(PERMISOS);
    this.usuarioActual.next(false);
    // this.storage.remove("intro-vista");
    return;
  }

  obtenerUsuario() {
    return this.usuarioActual.asObservable();
  }

  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.usuarioActual.value || !this.usuarioActual.value.permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }

}

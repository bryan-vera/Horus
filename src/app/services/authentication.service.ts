import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'mi-token';
const ID_DEPARTAMENTO = 'id-departamento';

export interface Usuario {
  idUsuario: number;
  idDepartamento: number;
  token: string;
}

@Injectable({
  providedIn: 'root'
})  

export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
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
    return this.http.post(`http://192.168.1.3:8069/Autenticacion/Authenticate`, credentials).pipe(
      map((data: Usuario)=>{
        if(data){
          this.storage.set(ID_DEPARTAMENTO,data.idDepartamento);
          this.storage.set("codigoUsuario",data.idUsuario);
          this.storage.set(TOKEN_KEY,data.token);
        }
        return;
      })
      ,
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.storage.remove("codigoUsuario");
    this.storage.remove("id-departamento");
    // this.storage.remove("intro-vista");
    return this.storage.remove(TOKEN_KEY);
  }

}

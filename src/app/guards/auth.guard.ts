import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter,take,map } from 'rxjs/operators';
import { AuthenticationService } from './../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthenticationService, 
    private router: Router, 
    private alertCtrl: AlertController){}


  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val=>val !== null),
      take(1),
      map(isAuthenticated =>{
        if(isAuthenticated){
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page!',
      buttons: ['OK']
    });
    alert.present();
  }

  canActivate(route: ActivatedRouteSnapshot) {
    // Get the potentially required role from the route
    const expectedRole = route.data?.role || null;
 
    return this.authService.obtenerUsuario().pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1),
      map(user => {   
             
        if (!user) {
          this.showAlert();
          return this.router.parseUrl('/')
        } else {
          let role = user['rol']; 
          if (!expectedRole || expectedRole == role) {
            return true;
          } else {
            this.showAlert();
            return false;
          }
        }
      })
    )
  }

}

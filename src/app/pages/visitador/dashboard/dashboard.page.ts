import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from 'src/app/services/http.service';
import { Storage } from '@ionic/storage-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  p_total:any;
  p_ventas:any;
  p_cobros:any;
  detalle_meta: any;
  codigoUsuario:any;
  fecha_desde: any;
  fecha_hasta: any;
  y:any;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private storage: Storage,
    public http: HttpService,
    public backgroundGeolocation: BackgroundGeolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings, 
    public foregroundService: ForegroundService,
    private platform: Platform,
    private backgroundMode: BackgroundMode,) { 
      this.inicializarApp();
      this.iniciarDashboard();
      // 
    }

  ngOnInit() {
  }

  public inicializarApp() {
    this.platform.ready().then(() => {
      // this.backgroundMode.on('activate').subscribe(s => {
      //   // this.backgroundMode.disableWebViewOptimizations();
      //   this.backgroundMode.disableBatteryOptimizations();
      //   console.log('Desactivando optimizacion de bateria');
      //   this.backgroundMode.setEnabled(true);
      this.checkGPSPermission();
      this.startBackgroundGeolocation();
        // this.backgroundGeolocation.start();
      // });
      // this.backgroundMode.enable();
      // this.foregroundService.start('Horus activado', 'Servicio de horus', 'drawable/fsicon');
      // console.log('Se acaba de activar el background mode');
    })
  }
  async getValue() {
      const value = await this.storage.get('codigoUsuario');
      this.codigoUsuario=value;
      return value;
  }

  doRefresh(event) {
    setTimeout(() => {
        this.iniciarDashboard().then(
          function(datos){
            console.log('Async operation has ended');
            event.target.complete();
          },function(error){
            console.log('Error');
          }
        )
      }, 1000);   
  }

  async iniciarDashboard(){
    this.getValue().then(data=>{
        this.http.obtenerPresupuesto(data)
        .subscribe(
          (res: any) => {
            this.detalle_meta = res;                    
            // this.p_total="20";
            this.p_ventas=Math.round(res.presupuesto_individual.alcance_venta);
            this.p_cobros=Math.round(res.presupuesto_individual.alcance_cobro);
            this.p_total= Math.round((this.p_ventas+this.p_cobros)/2);
          },
          (error) => {
            console.error(error);
          }
        );
      })
    // this.p_total="20";
  }
  
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


    //Check if application having GPS access permission  
    checkGPSPermission() {
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
            result => {
              if (result.hasPermission) {
                //If having permission show 'Turn On GPS' dialogue
                this.askToTurnOnGPS();
                // this.startBackgroundGeolocation();
              } else {
                //If not having permission ask for permission
                this.requestGPSPermission();
              }
            },
            err => {
              alert(err);
            }
          );
    }
  
    requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermissions(
            [this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION])
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS();
              },
              error => {
                //Show alert if user click on 'No Thanks'
                alert('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }
  
    askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          console.log("Se encuentran activados los permisos");
          this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS)
            .then((status) => {
              if (status != this.diagnostic.permissionStatus.GRANTED) {
                // Pregunta tres veces si se se procede
                // de otra manera te envia al setting de la aplicacion
                if (this.y < 3) {
                  this.y++;
                } else {
                  this.openNativeSettings.open("application_details");
                }              
                this.askToTurnOnGPS();
                }
            }).catch(e => console.error(e));
        });
    }

  async startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 0,
      interval: 1000,
      fastestInterval: 1000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
      startForeground: true,
      startOnBoot: true,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation
      .configure(config)
      .then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            console.log(location);
            let datosJSON = {
              latitud: location.latitude,
              longitud: location.longitude,
              id_usuario: this.codigoUsuario,
              indicador_mock: location.isFromMockProvider,
            };
            this.http.enviarDatosGPS(datosJSON).then(
              (res: any) => {
                console.log(res);
              },
              (error) => {
                console.error(error);
              }
            );
          });
      });

    this.backgroundGeolocation.start().then((state) => {
      console.log('state: ' + state);
    });
  }

}

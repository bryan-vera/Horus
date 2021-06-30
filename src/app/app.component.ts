import { Component } from '@angular/core';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { HttpService } from '../app/services/http.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  y:any;

  constructor(private platform: Platform,
    private backgroundMode: BackgroundMode,
    public foregroundService: ForegroundService,
    public http: HttpService,
    private backgroundGeolocation: BackgroundGeolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings) {
      // this.storage.create();
    // this.checkGPSPermission();
  }

  public inicializarApp() {
    this.platform.ready().then(() => {
      this.backgroundMode.on('activate').subscribe(s => {
        // this.backgroundMode.disableWebViewOptimizations();
        this.backgroundMode.disableBatteryOptimizations();
        console.log('Desactivando optimizacion de bateria');
        this.backgroundMode.setEnabled(true);
      });
      this.backgroundMode.enable();
      this.foregroundService.start('Horus activado', 'Servicio de horus', 'drawable/fsicon');
      console.log('Se acaba de activar el background mode');
      // this.startBackgroundGeolocation();
    })
  }

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: 10000
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
              id_usuario: 69,
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
    this.backgroundGeolocation.start();
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

}

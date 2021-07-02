import { Component, OnInit } from '@angular/core';
import {
  BackgroundGeolocation, BackgroundGeolocationConfig,
  BackgroundGeolocationEvents, BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HttpService } from 'src/app/services/http.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  locationCordinates: any;
  cordova: any;

  constructor(public actionSheetController: ActionSheetController,
    private backgroundGeolocation: BackgroundGeolocation,
    public localNotifications: LocalNotifications,
    private http: HttpService,
    private authService: AuthenticationService,
    private router: Router,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    public foregroundService: ForegroundService
    ) 
    { 
      this.locationCordinates = {
        latitude: "",
        longitude: "",
        accuracy: "",
        time: "",
        isFromMockProvider: ""
      }
      // this.inicializarApp();
    }

  ngOnInit() {
  }

  
  
  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      // interval: 10000
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
  
  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop();
  }

  showNotification(data) {
    // Schedule a single notification
    console.log("Notificacion");
    this.localNotifications.schedule({
      id: 1,
      text: JSON.stringify(data),
      sound: 'file://sound.mp3',
      data: { secret: "key" }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Inicia  background',
          icon: 'locate-outline',
          handler: () => {
            this.startBackgroundGeolocation();
            console.log('Encender geo');
          }
        }, {
          text: 'Apagar  background',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.stopBackgroundGeolocation();
            console.log('Apagar geo');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  currentLocPosition(response: any) {
    this.locationCordinates.latitude = response.latitude;
    this.locationCordinates.longitude = response.longitude;
    this.locationCordinates.accuracy = response.accuracy;
    this.locationCordinates.time = response.time;
    this.locationCordinates.falso = response.isFromMockProvider;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}

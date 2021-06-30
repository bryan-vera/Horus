import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Tab1Page } from '../tab1/tab1.page';
import { NavigationExtras } from '@angular/router';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';

const config: BackgroundGeolocationConfig = {
  desiredAccuracy: 10,
  stationaryRadius: 20,
  distanceFilter: 30,
  debug: true, //  enable this hear sounds for background-geolocation life-cycle.
  stopOnTerminate: false, // enable this to clear background location settings when the app terminates
};

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    private backgroundGeolocation: BackgroundGeolocation,
    public foregroundService: ForegroundService) { 
    }

  

  public scanCode() {
    let OpcionesBarcode: BarcodeScannerOptions
      = {
      torchOn: true,
      formats: 'CODE_128',
      disableSuccessBeep: false,
      showTorchButton: true,
    }

    this.barcodeScanner.scan(
      OpcionesBarcode
    ).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      let navigationExtras: NavigationExtras = {
        queryParams: { 'claveAcceso': barcodeData.text }
      };
      this.navCtrl.navigateForward(['/tabs/tab3'], navigationExtras);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  IniciarGPSBackground(){
    this.backgroundGeolocation.configure(config)
  .then(() => {
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
      console.log(location);
      this.backgroundGeolocation.finish(); // FOR IOS ONLY
    });

  });
  }

}

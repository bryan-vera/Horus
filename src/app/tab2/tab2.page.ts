import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { BarcodeScanner,BarcodeScannerOptions  } from '@ionic-native/barcode-scanner/ngx';
import { ToastController  } from '@ionic/angular';
import {Tab3Page} from '../tab3/tab3.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // constructor(public photoService: PhotoService) { }
  constructor(
    public barcodeScanner: BarcodeScanner,
    private toastController: ToastController
  ) {    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Código de barra encontrado ',
      duration: 2000
    });
    toast.present();
  }

  public scanCode(){ 
    this.barcodeScanner.scan().then(barcodeData => {
    console.log('Barcode data', barcodeData);
    this.presentToast();
   }).catch(err => {
       console.log('Error', err);
   });
  }
  

  // addPhotoToGallery() {
  //   this.photoService.addNewToGallery();
  // }

}

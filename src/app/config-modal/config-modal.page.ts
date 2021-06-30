import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.page.html',
  styleUrls: ['./config-modal.page.scss'],
})
export class ConfigModalPage implements OnInit {
  password_i: any;
  id_telefono: any;
  constructor(private storage: StorageService,
    public alertController: AlertController,
    private nativeStorage: NativeStorage,
    private store: Storage) {
    this.verID();
  }

  ngOnInit() {
  }

  async verID() {
    const resu = await this.storage.getID();
    console.log("Desde el log es: " + resu);
  }

  async guardarConfiguracion() {
    console.log(this.password_i);
    if (this.password_i == 1993) {
      console.log('Password correcta');
      // await this.storage.set('idUsuario', this.id_telefono);
      // const resu = await this.storage.getID();
      
      await this.setValue('codigoUsuario',this.id_telefono);
      // console.log(resu);
    } else {
      console.log('Password incorrecta');
      this.errorAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Listo',
      message: 'Se ha generado el cambio.',
      buttons: ['OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async errorAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Error',
      message: 'Clave erronea.',
      buttons: ['OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async setValue(key,value) {
    await this.store.set(key,value);
  }

}

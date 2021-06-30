import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { ModalPage } from '../modal/modal.page';
import { ConfigModalPage } from '../config-modal/config-modal.page';
import { AuthenticationService } from './../services/authentication.service';
import { Storage } from '@ionic/storage-angular';

// import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  facturasPre: any;
  facturas: any;
  colorBadge: string = '';
  codigoUsuario: any;
  modalDataResponse: any;

  constructor(private http: HttpService,
    private router: Router,
    public modalCtrl: ModalController,
    private store: Storage,
    private authService: AuthenticationService) {    
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.MostrarMisFacturas();
      }
    });    
  }

  async ionViewWillEnter() {
    await this.store.create();
    await this.getValue();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async getValue() {
    const value = await this.store.get('codigoUsuario');
    this.codigoUsuario=value;
    return value;
  }

  MostrarMisFacturas() {
    this.getValue().then(data=>{
      this.http.cargarMisFacturas(data)
      .subscribe(
        (res: any) => {
          this.facturas = res;
        },
        (error) => {
          console.error(error);
        }
      );
    })
    
  }

  async buscarFactura(empresa) {
    console.log(empresa);
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        'name': empresa
      }
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse !== null) {
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : ' + modalDataResponse.data);
      }
    });

    return await modal.present();
  }

  async abrirConfiguracion() {
    const modal = await this.modalCtrl.create({
      component: ConfigModalPage
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse !== null) {
        this.modalDataResponse = modalDataResponse.data;
      }
    });

    return await modal.present();
  }
}

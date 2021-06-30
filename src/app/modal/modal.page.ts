import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular'; 
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  // Data passed in by componentProps
  // @Input() firstName: string;
  // @Input() lastName: string;
  // @Input() middleInitial: string;  
  @Input() name: string;
  public facturas: any[];
  public facturasList: any[];
  public claveAcceso: any;

  constructor(public modalController: ModalController,
    private http: HttpService,
    public navCtrl: NavController,
    ) {
  }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async close() {
    const closeModal: string = "Modal Closed";
    await this.modalController.dismiss(closeModal);
  }

  async onCancel(evt){
    this.facturas = [];
  }

  async accederPicking(){
    console.log("Accedediendo a " + this.claveAcceso);
    const closeModal: string = "Modal Closed";
    await this.modalController.dismiss(closeModal);
    let navigationExtras: NavigationExtras = {
      queryParams: { 'claveAcceso': this.claveAcceso }
    };
    this.navCtrl.navigateForward(['/tabs/tab3'], navigationExtras);
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }

    this.http.cargarPickFactura(searchTerm,this.name).subscribe(
      (res: any) => {
        console.log(res.Empresa.toLowerCase());
        console.log(this.name.toLowerCase());
        if(res.Empresa.toLowerCase()==this.name.toLowerCase()){
          this.claveAcceso="0"+res.clave_acceso;
          this.facturas=res;
        }
      },
      (error) => {
        console.error(error);
      }
    );

    
  }

}

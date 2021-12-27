import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { HttpService } from '../services/http.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  claveAcceso: string;
  id_factura: any;
  detalles: any;
  estadoControl: string;
  resultado: any;
  alerta: any;
  codigoEstado:any;
  codigoUsuario='';
  // loading: any;

  constructor(private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private store: Storage) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.MostrarPicking();
      }
    });
  }


  async presentaAlerta() {
    this.alerta = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.estadoControl,
      message: '¿Estás seguro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar'
        },
        {
          text: 'Confirmar',
          role: 'confirmar',
          handler: () => {
            console.log("Se ha confirmado");
            this.grabarDatos();

          }
        }]
    });
    await this.alerta.present();
  }

  async getValue() {
    const value = await this.store.get('codigoUsuario');
    this.codigoUsuario=value;
    return value;
  }

  public grabarDatos() {
    this.getValue().then(data=>{
      this.presentLoading().then(() => {
        this.http.enviarDatos(this.detalles.IdFactura, 
            this.detalles.CodigoEstado,
            this.detalles.Secuencial,
            this.detalles.Empresa,
            this.codigoUsuario)
          .subscribe(
            (res: any) => {
              console.log(res);
              this.loadingController.dismiss();
              this.borrar();
              this.navCtrl.navigateForward(['/tabs/tab1']);
            },
            (error) => {
              console.error(error);
            }
          );
      })
    })
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espera...',
    });
    return loading.present();
  }

  public MostrarPicking() {
    this.route.queryParams.subscribe(params => {
      if(params["claveAcceso"] == null){
        this.claveAcceso="";
        this.id_factura = params["id_factura"];
      } else {
        this.claveAcceso=params["claveAcceso"];
        this.id_factura = "";
      }
      // this.claveAcceso = params["claveAcceso"];
      console.log(this.claveAcceso);
      console.log(this.id_factura);
    });
    // if(this.claveAcceso!=null){
      this.http.cargarPicking(this.claveAcceso,this.id_factura)
        .subscribe(
          (res: any) => {
            this.detalles = res;
            this.codigoEstado=res.CodigoEstado;
            switch (this.detalles.CodigoEstado) {
              case 0:
                this.estadoControl = "Iniciar picking";
                console.log("Iniciar picking");
                break;
              case 1:
                this.estadoControl = "Cerrar picking";
                console.log("Cerrar picking");
                break;
              case 2:
                this.estadoControl = "Iniciar despacho";
                console.log("Iniciar despacho");
                break;
              case 3:
                this.estadoControl = "Cerrar despacho";
                console.log("Cerrar despacho");
                break;
            }
          },
          (error) => {
            console.error(error);
          }
        );
    // } else { 
    //   console.log("El id de la factura es: " + this.id_factura);
    // }
  }

  // public MostrarDetalle() {
  //   this.route.queryParams.subscribe(params => {
  //     this.claveAcceso = params["claveAcceso"];
  //     console.log(this.claveAcceso);
  //   });
  //   this.http.cargarDetalle(this.claveAcceso)
  //     .subscribe(
  //       (res: any) => {
  //         this.detalles = JSON.parse(res);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  // }

  borrar(): void {
    this.detalles = [];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Storage } from '@ionic/storage-angular';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  items: any[] = [];
  public pedidos: any[] = [];
  codigoUsuario: any;
  public i: number =0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  

  constructor(private store: Storage,
    private http: HttpService) { 
      this.store.create();
      this.MostrarMisPedidos(0);    
  }

  ngOnInit() {
  }

  async ionViewWillEnter() { 
    await this.getValue();
  }

  async getValue() {
    const value = await this.store.get('codigoUsuario');
    this.codigoUsuario=value;
    return value;
  }

  async MostrarMisPedidos(pagina) {
    this.getValue().then(data=>{
      this.http.cargarMisPedidos(data,pagina)
      .subscribe(
        (res: any) => {  
          this.i++;
          for(let j=0;j<res.length;j++ ) {
            this.pedidos.push({
              estado: res[j].estado,
              numero: res[j].numero,
              nombre_comercial: res[j].nombre_comercial,
              valor_pedido: res[j].valor_pedido,
              fecha_creacion_pedido: res[j].fecha_creacion_pedido,
              fecha_autorizacion_pedido: res[j].fecha_autorizacion_pedido,
              secuencial_factura: res[j].secuencial_factura, 
              // numero: res[j].numero,
            });
          }
          // this.pedidos.push(res);
          // this.virtualScroll.checkRange(0);
        },
        (error) => {
          console.error(error);
        }
      );
    })
  }

  loadData(event) {
    this.MostrarMisPedidos(this.i).then(()=>{
      event.target.complete();
      this.virtualScroll.checkEnd();
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async filtrarLista(evt) {
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      this.i=0;
      this.MostrarMisPedidos(this.i);
    }
    this.getValue().then(data=>{
        this.http.cargarMisPedidosBusqueda(data,searchTerm).subscribe(
          (res: any) => {
            this.pedidos=[];
            console.log(searchTerm.toLowerCase());
            for(let j=0;j<res.length;j++ ) {
              this.pedidos.push({
                estado: res[j].estado,
                numero: res[j].numero,
                nombre_comercial: res[j].nombre_comercial,
                valor_pedido: res[j].valor_pedido,
                fecha_creacion_pedido: res[j].fecha_creacion_pedido,
                fecha_autorizacion_pedido: res[j].fecha_autorizacion_pedido, 
                secuencial_factura: res[j].secuencial_factura, 
              });
            }
          },
          (error) => {
            console.error(error);
          }
        );    
    }) 
  }


}

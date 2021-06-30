import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'estados'
})

export class EstadosPipe implements PipeTransform {
    public tranDatos: any =null;
    transform(any) {
        let res = '';
        let color='danger';
        switch (any) {
            case 0:
                res='En espera';
                color='danger';
                break;
            case 1:
                res='Picking iniciado';
                color='primary';
                break;
            case 2:
                res='Picking cerrado';
                color='secondary';
                break;
            case 3:
                res='Despacho iniciado';
                color='tertiary';
                break;
            case 4:
                res='Despacho cerrado';
                color='success';
                break;
        
            default:
                break;
        }
        // this.tranDatos.texto=res;
        // this.tranDatos.color=color;
        return  {"texto":res,"color":color} ;
    }
}
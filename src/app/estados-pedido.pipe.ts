import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadosPedido'
})
export class EstadosPedidoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';

@Pipe({
  name: 'ordenIngreso',
})
export class OrdenIngresoPipe implements PipeTransform {
  transform(items: IngresosEgresos[]): IngresosEgresos[] {
    return items.slice().sort((a, b) => {
      if (a.tipo === 'ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}

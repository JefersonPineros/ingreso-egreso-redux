import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresosEgresos } from '../../model/ingresos/ingresos-egresos';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
})
export class DetalleComponent implements OnInit, OnDestroy {
  public ingresosEgresos: IngresosEgresos[] = [];
  public ingresosSubs: Subscription | undefined;

  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe({
      next: ({ items }) => {
        console.log(items);
        this.ingresosEgresos = items;
      },
    });
  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe();
  }

  borrarItem(uid?: string) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then((accion) => {
        Swal.fire('Borrado', 'Se ha borrado el item', 'success');
      })
      .catch((err) => {
        Swal.fire('Error!', err.message, 'error');
      });
  }
}

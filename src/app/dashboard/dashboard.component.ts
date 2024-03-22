import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Usuario } from '../model/users/usuarioModel';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private userSubs: Subscription | undefined;
  private ingresosSubs: Subscription | undefined;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user != null))
      .subscribe({
        next: ({ user }) => {
          this.ingresosSubs = this.ingresoEgresoService
            .initIngresosEgresosListener(user!.uid)
            .subscribe({
              next: (ingresosEgresosfb) => {
                const listIngresoEgreso: Array<IngresosEgresos> =
                  ingresosEgresosfb as Array<IngresosEgresos>;
                this.store.dispatch(
                  ingresoEgresoActions.setItems({ items: listIngresoEgreso })
                );
              },
            });
        },
      });
  }
  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresosSubs?.unsubscribe();
  }
}

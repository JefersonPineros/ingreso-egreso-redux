import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DetalleComponent } from './detalle/detalle.component';
import { OrdenIngresoPipe } from '../pipes/orden-ingreso.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { StoreModule } from '@ngrx/store';
import { _ingresoEgresoReducer } from './ingreso-egreso.reducer';

@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoPipe,
  ],
  imports: [
    CommonModule,
    DashboardRoutesModule,
    StoreModule.forFeature('ingresosEgresos', _ingresoEgresoReducer),

    ReactiveFormsModule,
    NgxSpinnerModule,
    BaseChartDirective,

    SharedModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IngresoEgresoModule {}

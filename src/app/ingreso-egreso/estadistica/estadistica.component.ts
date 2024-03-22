import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresosEgresos } from '../../model/ingresos/ingresos-egresos';

import { ChartData, ChartEvent, ChartType, Chart } from 'chart.js';
import * as Chartjs from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
//import { ChartHostComponent } from '../chart-host/chart-host.component';

const controllers: any = Object.values(Chartjs).filter(
  (chart: any) => chart.id !== undefined
);

Chart.register(...controllers);

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrl: './estadistica.component.css',
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  public ingresos: number = 0;
  public egresos: number = 0;
  public totalIngresos: number = 0;
  public totalEgresos: number = 0;

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };

  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('ingresosEgresos').subscribe({
      next: ({ items }) => {
        this.generarEstadistica(items);
      },
    });
  }

  ngOnDestroy(): void {}

  generarEstadistica(items: IngresosEgresos[]) {
    this.ingresos = 0;
    this.totalIngresos = 0;
    this.egresos = 0;
    this.totalEgresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData.datasets[0].data[0] = this.totalIngresos;
    this.doughnutChartData.datasets[0].data[1] = this.totalEgresos;
  }
}

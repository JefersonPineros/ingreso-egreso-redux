import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresosEgresos } from '../model/ingresos/ingresos-egresos';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { NgxSpinnerService } from 'ngx-spinner';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrl: './ingreso-egreso.component.css',
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  public ingresoForm: FormGroup;
  public tipo: string = 'ingreso';
  public isLoad: boolean = false;
  public loadingSubs: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>,
    private spinner: NgxSpinnerService
  ) {
    this.ingresoForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.loadingSubs = this.store.select('ui').subscribe({
      next: (ui) => {
        this.isLoad = ui.isLoading;
      },
    });
  }

  ngOnDestroy(): void {
    this.loadingSubs?.unsubscribe();
  }

  onSubmit() {
    this.store.dispatch(isLoading());
    this.validLoading();

    if (this.ingresoForm.invalid) {
      return;
    }
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresosEgresos(descripcion, monto, this.tipo);

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((values) => {
        this.ingresoForm.reset();
        this.store.dispatch(stopLoading());
        this.validLoading();
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((error) => {
        Swal.fire('Error', error.message, 'error');
        this.store.dispatch(stopLoading());
        this.validLoading();
      });
  }

  validLoading() {
    if (this.isLoad) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }
}

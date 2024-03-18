import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public load: boolean = false;
  public uiSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private store: Store<AppState>
  ) {
    this.formGroup = new FormGroup({});
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.load = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription?.unsubscribe();
  }

  crearUsuario() {
    this.store.dispatch(ui.isLoading());
    this.validLoading();
    if (this.formGroup.invalid) {
      return;
    }

    this.auth
      .crearUsuario(this.formGroup.value)
      .then((credenciales) => {
        this.store.dispatch(ui.stopLoading());
        this.validLoading();
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.validLoading();
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.message}`,
        });
      });
  }

  validLoading() {
    if (this.load) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }
}

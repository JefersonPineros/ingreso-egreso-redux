import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
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

  login() {
    this.store.dispatch(ui.isLoading());
    this.validLoading();
    if (this.formGroup.invalid) {
      return;
    }

    this.auth
      .loginUsuario(this.formGroup.value)
      .then((credenciales) => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
        this.validLoading();
      })
      .catch((error) => {
        this.store.dispatch(ui.stopLoading());
        this.validLoading();
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

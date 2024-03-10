import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.formGroup = new FormGroup({});
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.spinner.show();
    if (this.formGroup.invalid) {
      return;
    }

    this.auth
      .loginUsuario(this.formGroup.value)
      .then((credenciales) => {
        this.router.navigate(['/']);
        this.spinner.hide();
      })
      .catch((error) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.message}`,
        });
      });
  }
}

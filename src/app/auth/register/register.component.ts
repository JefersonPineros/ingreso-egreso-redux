import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
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
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crearUsuario() {
    this.spinner.show();
    if (this.formGroup.invalid) {
      return;
    }

    this.auth
      .crearUsuario(this.formGroup.value)
      .then((credenciales) => {
        this.spinner.hide();
        this.router.navigate(['/']);
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

import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ingresoEgresoApp';

  constructor(private auth: AuthService) {
    this.auth.initAuthListener();
  }
  ngOnInit(): void {}
}

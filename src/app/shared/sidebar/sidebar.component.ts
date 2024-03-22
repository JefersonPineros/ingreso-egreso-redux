import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  public userName: string = '';
  public userSubs: Subscription | undefined;
  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter(({ user }) => user !== null))
      .subscribe({
        next: ({ user }) => (this.userName = user?.nombre!),
      });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }

  logOut() {
    this.auth.logOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

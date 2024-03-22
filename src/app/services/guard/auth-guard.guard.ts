import { inject } from '@angular/core';
import { CanActivateFn, CanLoadFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { take, tap } from 'rxjs';

const authGuardGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * El metodo tap funciona para disparar un efecto secundario
   */
  return authService.isAuth().pipe(
    tap((estado) => {
      if (!estado) {
        router.navigate(['/login']);
      }
    }),
    take(1)
  );
};

export const canActivate: CanActivateFn = authGuardGuard;
export const canMatch: CanMatchFn = authGuardGuard;

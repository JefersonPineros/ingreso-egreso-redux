import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
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
    })
  );
};

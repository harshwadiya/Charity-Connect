import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const expectedRole = route.data['role'];
    const currentRole = authService.getRole();

    if (expectedRole && expectedRole !== currentRole) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};
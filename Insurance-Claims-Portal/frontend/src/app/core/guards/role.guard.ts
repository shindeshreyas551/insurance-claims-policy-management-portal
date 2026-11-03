import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as UserRole[];
  const userRole = authService.currentUserRole();

  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  // Redirect to appropriate landing depending on role
  if (userRole === 'ADMIN') {
    router.navigate(['/admin/dashboard']);
  } else if (userRole === 'OFFICER') {
    router.navigate(['/officer/dashboard']);
  } else {
    router.navigate(['/customer/dashboard']);
  }

  return false;
};


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // Navigate based on role
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.user.role === 'OFFICER') {
          this.router.navigate(['/officer/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password. Please verify your credentials.';
      },
    });
  }

  // Quick Demo Auto-Fill Helpers for Academic Evaluation / Viva
  fillCredentials(role: 'ADMIN' | 'OFFICER' | 'CUSTOMER'): void {
    if (role === 'ADMIN') {
      this.loginForm.setValue({
        email: 'admin@insurance.portal',
        password: 'AdminPassword@123',
      });
    } else if (role === 'OFFICER') {
      this.loginForm.setValue({
        email: 'officer.rajesh@insurance.portal',
        password: 'Officer@123',
      });
    } else {
      this.loginForm.setValue({
        email: 'customer.shreyas@insurance.portal',
        password: 'Customer@123',
      });
    }
  }
}


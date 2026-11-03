import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-titles">
          <h1>Account & Security Settings</h1>
          <p>Manage your contact details, security credentials, and identity preferences.</p>
        </div>
      </div>

      @if (successMessage) {
        <div class="alert alert-success mb-4">
          <span class="material-icons">check_circle</span>
          <span>{{ successMessage }}</span>
        </div>
      }

      @if (errorMessage) {
        <div class="alert alert-danger mb-4">
          <span class="material-icons">error_outline</span>
          <span>{{ errorMessage }}</span>
        </div>
      }

      <div class="profile-grid">
        <!-- Profile Info Card -->
        <div class="app-card">
          <div class="card-header">
            <h3>Personal Information</h3>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
            <div class="form-group">
              <label>Email Address (Immutable)</label>
              <input type="email" class="form-control" [value]="user?.email" disabled />
            </div>

            <div class="form-group">
              <label>Assigned System Role</label>
              <div>
                <span class="status-badge role-{{ user?.role }}">{{ user?.role }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="name">Full Name *</label>
              <input id="name" type="text" class="form-control" formControlName="name" />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input id="phone" type="tel" class="form-control" formControlName="phone" />
            </div>

            <div class="form-group">
              <label for="address">Residential Address</label>
              <textarea id="address" rows="3" class="form-control" formControlName="address"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="isUpdatingProfile || profileForm.invalid">
              @if (isUpdatingProfile) { Saving... } @else { Save Changes }
            </button>
          </form>
        </div>

        <!-- Security / Password Card -->
        <div class="app-card">
          <div class="card-header">
            <h3>Change Password</h3>
          </div>

          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
            <div class="form-group">
              <label for="currPass">Current Password *</label>
              <input id="currPass" type="password" class="form-control" formControlName="currentPassword" />
            </div>

            <div class="form-group">
              <label for="newPass">New Password *</label>
              <input id="newPass" type="password" class="form-control" formControlName="newPassword" placeholder="Min 6 characters" />
              @if (passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.errors?.['minlength']) {
                <div class="form-error">New password must be at least 6 characters.</div>
              }
            </div>

            <button type="submit" class="btn btn-secondary" [disabled]="isChangingPassword || passwordForm.invalid">
              @if (isChangingPassword) { Updating... } @else { Update Password }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }
    .mb-4 { margin-bottom: 1.5rem; }
  `],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  user: User | null = null;
  isUpdatingProfile = false;
  isChangingPassword = false;
  successMessage = '';
  errorMessage = '';

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    address: [''],
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.user = this.authService.currentUserSignal();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        phone: this.user.phone || '',
        address: this.user.address || '',
      });
    }

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.user;
        if (this.user) {
          this.profileForm.patchValue({
            name: this.user.name,
            phone: this.user.phone || '',
            address: this.user.address || '',
          });
        }
      },
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.isUpdatingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.isUpdatingProfile = false;
        this.user = res.user;
        this.successMessage = 'Profile updated successfully.';
      },
      error: (err: any) => {
        this.isUpdatingProfile = false;
        this.errorMessage = err.error?.message || 'Failed to update profile.';
      },
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isChangingPassword = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.successMessage = 'Password changed successfully.';
      },
      error: (err: any) => {
        this.isChangingPassword = false;
        this.errorMessage = err.error?.message || 'Failed to change password.';
      },
    });
  }
}

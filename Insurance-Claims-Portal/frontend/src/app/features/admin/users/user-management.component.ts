import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  isCreating = false;
  showCreateModal = false;
  errorMessage = '';
  successMessage = '';

  selectedRoleFilter: UserRole | '' = '';
  searchTerm = '';

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['OFFICER', [Validators.required]],
    phone: [''],
    address: [''],
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers({ role: this.selectedRoleFilter }).subscribe({
      next: (res) => {
        this.users = res.users;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load user directory.';
        this.isLoading = false;
      },
    });
  }

  filterRole(role: UserRole | ''): void {
    this.selectedRoleFilter = role;
    this.fetchUsers();
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
    );
  }

  toggleActive(id: string): void {
    this.userService.toggleUserStatus(id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.fetchUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to toggle status.';
      },
    });
  }

  openCreateModal(): void {
    this.userForm.reset({ role: 'OFFICER' });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isCreating = true;
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.isCreating = false;
        this.showCreateModal = false;
        this.successMessage = 'Staff account generated successfully.';
        this.fetchUsers();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage = err.error?.message || 'Failed to create user.';
      },
    });
  }
}


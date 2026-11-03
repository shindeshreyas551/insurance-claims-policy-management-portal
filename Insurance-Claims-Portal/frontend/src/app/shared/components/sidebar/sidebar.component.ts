import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  authService = inject(AuthService);

  @Input() isOpen = true;

  get role() {
    return this.authService.currentUserRole();
  }

  get navItems(): NavItem[] {
    const currentRole = this.role;

    if (currentRole === 'ADMIN') {
      return [
        { label: 'Admin Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Insurance Policies', route: '/admin/policies', icon: 'shield' },
        { label: 'Policy Applications', route: '/admin/applications', icon: 'assignment' },
        { label: 'All Claims', route: '/claims', icon: 'description' },
        { label: 'User Management', route: '/admin/users', icon: 'people' },
        { label: 'Reports & Export', route: '/reports', icon: 'analytics' },
        { label: 'System Audit Logs', route: '/admin/audit-logs', icon: 'history' },
        { label: 'My Profile', route: '/profile', icon: 'person' },
      ];
    }

    if (currentRole === 'OFFICER') {
      return [
        { label: 'Officer Dashboard', route: '/officer/dashboard', icon: 'dashboard' },
        { label: 'Claims Verification', route: '/claims', icon: 'pending_actions' },
        { label: 'Browse Policies', route: '/policies', icon: 'policy' },
        { label: 'Claims Reports', route: '/reports', icon: 'bar_chart' },
        { label: 'Notifications', route: '/notifications', icon: 'notifications' },
        { label: 'My Profile', route: '/profile', icon: 'person' },
      ];
    }

    // Default: Customer
    return [
      { label: 'Dashboard', route: '/customer/dashboard', icon: 'dashboard' },
      { label: 'Browse Policies', route: '/policies', icon: 'search' },
      { label: 'My Policies', route: '/my-policies', icon: 'folder_shared' },
      { label: 'File New Claim', route: '/claims/submit', icon: 'add_circle' },
      { label: 'My Claims History', route: '/claims', icon: 'description' },
      { label: 'Notifications', route: '/notifications', icon: 'notifications' },
      { label: 'Profile Settings', route: '/profile', icon: 'person' },
    ];
  }
}


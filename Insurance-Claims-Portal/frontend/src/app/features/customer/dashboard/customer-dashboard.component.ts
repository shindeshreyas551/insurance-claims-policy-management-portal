import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerDashboardData } from '../../../shared/models/dashboard.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  authService = inject(AuthService);

  dashboardData: CustomerDashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  get user() {
    return this.authService.currentUserSignal();
  }

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getCustomerDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load customer dashboard data.';
        this.isLoading = false;
      },
    });
  }
}


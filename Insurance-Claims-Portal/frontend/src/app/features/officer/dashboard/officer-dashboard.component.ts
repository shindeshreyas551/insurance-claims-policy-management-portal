import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClaimService } from '../../../core/services/claim.service';
import { OfficerDashboardData } from '../../../shared/models/dashboard.model';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss'],
})
export class OfficerDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private claimService = inject(ClaimService);
  authService = inject(AuthService);

  dashboardData: OfficerDashboardData | null = null;
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
    this.dashboardService.getOfficerDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load officer metrics.';
        this.isLoading = false;
      },
    });
  }

  claimForReview(claimId: string): void {
    if (!this.user) return;
    this.claimService.assignOfficer(claimId, this.user.id).subscribe({
      next: () => {
        this.fetchDashboard();
      },
    });
  }
}


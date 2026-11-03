import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AdminDashboardData } from '../../../shared/models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);

  @ViewChild('monthlyChartCanvas') monthlyChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChartCanvas') statusChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('amountChartCanvas') amountChartCanvas!: ElementRef<HTMLCanvasElement>;

  dashboardData: AdminDashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  private charts: Chart[] = [];

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getAdminDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res.data;
        this.isLoading = false;
        setTimeout(() => this.renderCharts(), 50);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to fetch admin dashboard.';
        this.isLoading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.dashboardData) {
      this.renderCharts();
    }
  }

  renderCharts(): void {
    this.destroyCharts();
    if (!this.dashboardData) return;

    // 1. Monthly Claims Trend Chart
    if (this.monthlyChartCanvas?.nativeElement) {
      const ctx = this.monthlyChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const c = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.dashboardData.charts.monthly.labels,
            datasets: [
              {
                label: 'Claims Submitted',
                data: this.dashboardData.charts.monthly.claimsCounts,
                borderColor: '#1d4ed8',
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                tension: 0.35,
                fill: true,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
        this.charts.push(c);
      }
    }

    // 2. Claims by Status (Doughnut)
    if (this.statusChartCanvas?.nativeElement) {
      const ctx = this.statusChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const dist = this.dashboardData.charts.statusDistribution;
        const labels = Object.keys(dist).map((s) => s.replace(/_/g, ' '));
        const data = Object.values(dist);

        const c = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  '#38bdf8', // SUBMITTED
                  '#f59e0b', // UNDER_REVIEW
                  '#8b5cf6', // ADDITIONAL_DOCS
                  '#10b981', // APPROVED
                  '#ef4444', // REJECTED
                  '#0d9488', // SETTLED
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
            },
          },
        });
        this.charts.push(c);
      }
    }

    // 3. Category Distribution (Bar)
    if (this.categoryChartCanvas?.nativeElement) {
      const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const catMap = this.dashboardData.charts.categoryDistribution;
        const labels = Object.keys(catMap);
        const data = Object.values(catMap);

        const c = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Claims by Category',
                data,
                backgroundColor: ['#0284c7', '#7c3aed', '#ea580c', '#059669', '#db2777'],
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
        this.charts.push(c);
      }
    }

    // 4. Monthly Claim Amount vs Settled Amount
    if (this.amountChartCanvas?.nativeElement) {
      const ctx = this.amountChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const c = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.dashboardData.charts.monthly.labels,
            datasets: [
              {
                label: 'Claimed (₹)',
                data: this.dashboardData.charts.monthly.claimedAmounts,
                backgroundColor: '#93c5fd',
                borderRadius: 4,
              },
              {
                label: 'Settled (₹)',
                data: this.dashboardData.charts.monthly.settledAmounts,
                backgroundColor: '#10b981',
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } },
          },
        });
        this.charts.push(c);
      }
    }
  }

  destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}


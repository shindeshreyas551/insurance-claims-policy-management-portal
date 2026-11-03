import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Claim } from '../../shared/models/claim.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private userService = inject(UserService);
  authService = inject(AuthService);

  claims: Claim[] = [];
  officers: User[] = [];

  summary = {
    totalRecords: 0,
    totalClaimedAmount: 0,
    totalApprovedAmount: 0,
    totalSettledAmount: 0,
  };

  filter = {
    startDate: '',
    endDate: '',
    category: '',
    status: '',
    officerId: '',
    search: '',
  };

  isLoading = true;
  isExporting = false;

  categories = ['HEALTH', 'LIFE', 'VEHICLE', 'HOME', 'TRAVEL'];
  statuses = ['SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_DOCS_REQUIRED', 'APPROVED', 'REJECTED', 'SETTLED'];

  ngOnInit(): void {
    this.fetchReport();
    this.fetchOfficers();
  }

  fetchReport(): void {
    this.isLoading = true;
    this.reportService.getClaimsReport(this.filter).subscribe({
      next: (res) => {
        this.claims = res.claims;
        this.summary = res.summary;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  fetchOfficers(): void {
    this.userService.getOfficers().subscribe({
      next: (res) => {
        this.officers = res.officers;
      },
    });
  }

  onFilterChange(): void {
    this.fetchReport();
  }

  resetFilter(): void {
    this.filter = {
      startDate: '',
      endDate: '',
      category: '',
      status: '',
      officerId: '',
      search: '',
    };
    this.fetchReport();
  }

  exportCSV(): void {
    this.isExporting = true;
    this.reportService.downloadCSV(this.filter).subscribe({
      next: (blob: Blob) => {
        this.isExporting = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insurance_claims_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.isExporting = false;
        alert('Failed to generate CSV export.');
      },
    });
  }
}

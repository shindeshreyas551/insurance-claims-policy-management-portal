import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../core/services/claim.service';
import { AuthService } from '../../../core/services/auth.service';
import { Claim, ClaimStatus } from '../../../shared/models/claim.model';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.scss'],
})
export class ClaimListComponent implements OnInit {
  private claimService = inject(ClaimService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  isLoading = true;
  errorMessage = '';

  selectedStatus: ClaimStatus | '' = '';
  searchTerm = '';

  statusTabs: { label: string; value: ClaimStatus | '' }[] = [
    { label: 'All Claims', value: '' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Docs Needed', value: 'ADDITIONAL_DOCS_REQUIRED' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Settled', value: 'SETTLED' },
  ];

  ngOnInit(): void {
    const qStatus = this.route.snapshot.queryParamMap.get('status') as ClaimStatus | null;
    if (qStatus) {
      this.selectedStatus = qStatus;
    }
    this.fetchClaims();
  }

  fetchClaims(): void {
    this.isLoading = true;
    this.claimService.getClaims().subscribe({
      next: (res) => {
        this.claims = res.claims;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load claims.';
        this.isLoading = false;
      },
    });
  }

  selectStatus(status: ClaimStatus | ''): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.claims];

    if (this.selectedStatus) {
      result = result.filter((c) => c.status === this.selectedStatus);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.customer?.name && c.customer.name.toLowerCase().includes(q)) ||
          (c.policy?.name && c.policy.name.toLowerCase().includes(q))
      );
    }

    this.filteredClaims = result;
  }
}


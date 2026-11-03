import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../../core/services/policy.service';
import { AuthService } from '../../../core/services/auth.service';
import { Policy, PolicyCategory } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss'],
})
export class PolicyListComponent implements OnInit {
  private policyService = inject(PolicyService);
  authService = inject(AuthService);

  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  isLoading = true;
  errorMessage = '';

  selectedCategory: PolicyCategory | '' = '';
  searchTerm = '';

  categories: { label: string; value: PolicyCategory | '' }[] = [
    { label: 'All Plans', value: '' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Life', value: 'LIFE' },
    { label: 'Vehicle', value: 'VEHICLE' },
    { label: 'Home', value: 'HOME' },
    { label: 'Travel', value: 'TRAVEL' },
  ];

  ngOnInit(): void {
    this.fetchPolicies();
  }

  fetchPolicies(): void {
    this.isLoading = true;
    this.policyService.getPolicies({ activeOnly: true }).subscribe({
      next: (res) => {
        this.policies = res.policies;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load insurance plans.';
        this.isLoading = false;
      },
    });
  }

  selectCategory(cat: PolicyCategory | ''): void {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.policies];

    if (this.selectedCategory) {
      result = result.filter((p) => p.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.policyNumber.toLowerCase().includes(q)
      );
    }

    this.filteredPolicies = result;
  }
}


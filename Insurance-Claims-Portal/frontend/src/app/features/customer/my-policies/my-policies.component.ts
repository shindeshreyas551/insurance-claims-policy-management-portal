import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerPolicyService } from '../../../core/services/customerPolicy.service';
import { CustomerPolicy } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-policies.component.html',
  styleUrls: ['./my-policies.component.scss'],
})
export class MyPoliciesComponent implements OnInit {
  private customerPolicyService = inject(CustomerPolicyService);

  policies: CustomerPolicy[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchPolicies();
  }

  fetchPolicies(): void {
    this.isLoading = true;
    this.customerPolicyService.getMyPolicies().subscribe({
      next: (res) => {
        this.policies = res.policies;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load your policies.';
        this.isLoading = false;
      },
    });
  }
}


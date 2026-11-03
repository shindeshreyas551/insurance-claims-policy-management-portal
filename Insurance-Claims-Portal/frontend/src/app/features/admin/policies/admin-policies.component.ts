import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy, PolicyCategory } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-policies.component.html',
  styleUrls: ['./admin-policies.component.scss'],
})
export class AdminPoliciesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);

  policies: Policy[] = [];
  isLoading = true;
  isSaving = false;
  showCreateModal = false;
  errorMessage = '';
  successMessage = '';

  policyForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['HEALTH', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    premiumAmount: [null, [Validators.required, Validators.min(100)]],
    coverageAmount: [null, [Validators.required, Validators.min(1000)]],
    durationMonths: [12, [Validators.required, Validators.min(1)]],
    eligibility: ['', [Validators.required, Validators.minLength(5)]],
    termsAndConditions: ['', [Validators.required, Validators.minLength(10)]],
  });

  categories: PolicyCategory[] = ['HEALTH', 'LIFE', 'VEHICLE', 'HOME', 'TRAVEL'];

  ngOnInit(): void {
    this.fetchPolicies();
  }

  fetchPolicies(): void {
    this.isLoading = true;
    this.policyService.getPolicies().subscribe({
      next: (res) => {
        this.policies = res.policies;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load policy list.';
        this.isLoading = false;
      },
    });
  }

  toggleStatus(id: string): void {
    this.policyService.togglePolicyStatus(id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.fetchPolicies();
      },
    });
  }

  openCreateModal(): void {
    this.policyForm.reset({
      category: 'HEALTH',
      durationMonths: 12,
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSubmit(): void {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formVal = this.policyForm.value;

    const payload = {
      ...formVal,
      premiumAmount: Number(formVal.premiumAmount),
      coverageAmount: Number(formVal.coverageAmount),
      durationMonths: Number(formVal.durationMonths),
    };

    this.policyService.createPolicy(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.showCreateModal = false;
        this.successMessage = 'Policy plan created successfully.';
        this.fetchPolicies();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to create policy.';
      },
    });
  }
}


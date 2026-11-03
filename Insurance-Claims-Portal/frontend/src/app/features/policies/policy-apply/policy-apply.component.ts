import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Policy } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-policy-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './policy-apply.component.html',
  styleUrls: ['./policy-apply.component.scss'],
})
export class PolicyApplyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);
  private applicationService = inject(ApplicationService);

  policy: Policy | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  applyForm: FormGroup = this.fb.group({
    nomineeName: ['', [Validators.required, Validators.minLength(2)]],
    nomineeRelation: ['Spouse', [Validators.required]],
    annualIncome: [null, [Validators.required, Validators.min(10000)]],
    existingConditions: [''],
    remarks: [''],
    declaration: [false, [Validators.requiredTrue]],
  });

  relations = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];

  ngOnInit(): void {
    const policyId = this.route.snapshot.paramMap.get('id');
    if (policyId) {
      this.fetchPolicy(policyId);
    }
  }

  fetchPolicy(id: string): void {
    this.isLoading = true;
    this.policyService.getPolicyById(id).subscribe({
      next: (res) => {
        this.policy = res.policy;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Policy not found.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.applyForm.invalid || !this.policy) {
      this.applyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      policyId: this.policy.id,
      nomineeName: this.applyForm.value.nomineeName,
      nomineeRelation: this.applyForm.value.nomineeRelation,
      annualIncome: Number(this.applyForm.value.annualIncome),
      existingConditions: this.applyForm.value.existingConditions,
      remarks: this.applyForm.value.remarks,
    };

    this.applicationService.submitApplication(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Application submitted successfully! Redirecting to your dashboard...';
        setTimeout(() => {
          this.router.navigate(['/customer/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to submit application. Please verify details.';
      },
    });
  }
}


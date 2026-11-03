import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClaimService } from '../../../core/services/claim.service';
import { CustomerPolicyService } from '../../../core/services/customerPolicy.service';
import { CustomerPolicy } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-claim-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './claim-submit.component.html',
  styleUrls: ['./claim-submit.component.scss'],
})
export class ClaimSubmitComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private claimService = inject(ClaimService);
  private customerPolicyService = inject(CustomerPolicyService);

  activePolicies: CustomerPolicy[] = [];
  selectedPolicy: CustomerPolicy | null = null;
  uploadedFiles: File[] = [];

  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  claimForm: FormGroup = this.fb.group({
    customerPolicyId: ['', [Validators.required]],
    incidentDate: ['', [Validators.required]],
    claimAmount: [null, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(15)]],
  });

  ngOnInit(): void {
    this.fetchActivePolicies();
  }

  fetchActivePolicies(): void {
    this.isLoading = true;
    this.customerPolicyService.getMyPolicies().subscribe({
      next: (res) => {
        this.activePolicies = res.policies.filter((p) => p.status === 'ACTIVE');
        this.isLoading = false;

        const preselectedId = this.route.snapshot.queryParamMap.get('customerPolicyId');
        if (preselectedId) {
          this.claimForm.patchValue({ customerPolicyId: preselectedId });
          this.onPolicyChange(preselectedId);
        } else if (this.activePolicies.length > 0) {
          this.claimForm.patchValue({ customerPolicyId: this.activePolicies[0].id });
          this.onPolicyChange(this.activePolicies[0].id);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load active policies.';
        this.isLoading = false;
      },
    });
  }

  onPolicyChange(policyId: string): void {
    this.selectedPolicy = this.activePolicies.find((p) => p.id === policyId) || null;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5MB maximum limit.`);
        continue;
      }
      if (this.uploadedFiles.length < 5) {
        this.uploadedFiles.push(file);
      } else {
        alert('You can upload a maximum of 5 supporting documents.');
        break;
      }
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    if (this.selectedPolicy && Number(this.claimForm.value.claimAmount) > this.selectedPolicy.coverageAmount) {
      this.errorMessage = `Claim amount cannot exceed the policy coverage limit of ₹${this.selectedPolicy.coverageAmount.toLocaleString()}.`;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('customerPolicyId', this.claimForm.value.customerPolicyId);
    formData.append('incidentDate', this.claimForm.value.incidentDate);
    formData.append('claimAmount', String(this.claimForm.value.claimAmount));
    formData.append('description', this.claimForm.value.description);

    for (const file of this.uploadedFiles) {
      formData.append('documents', file, file.name);
    }

    this.claimService.submitClaim(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = `Claim ${res.claim.claimNumber} registered successfully! Redirecting...`;
        setTimeout(() => {
          this.router.navigate(['/claims', res.claim.id]);
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Claim submission failed. Please check the entered data.';
      },
    });
  }
}


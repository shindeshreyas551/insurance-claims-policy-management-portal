import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClaimService } from '../../../core/services/claim.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Claim, ClaimStatus } from '../../../shared/models/claim.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './claim-detail.component.html',
  styleUrls: ['./claim-detail.component.scss'],
})
export class ClaimDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  claimService = inject(ClaimService);
  private userService = inject(UserService);
  authService = inject(AuthService);

  claim: Claim | null = null;
  officersList: User[] = [];
  isLoading = true;
  isActionLoading = false;
  errorMessage = '';
  successMessage = '';

  // Additional documents upload for customer
  additionalFiles: File[] = [];
  isUploadingDocs = false;

  // Review Form for Officer / Admin
  reviewForm: FormGroup = this.fb.group({
    targetStatus: ['UNDER_REVIEW', [Validators.required]],
    remarks: ['', [Validators.required, Validators.minLength(3)]],
    approvedAmount: [null],
    rejectionReason: [''],
  });

  // Assign Officer Form
  assignForm: FormGroup = this.fb.group({
    officerId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchClaim(id);
    }

    if (this.authService.isAdmin()) {
      this.fetchOfficers();
    }
  }

  fetchClaim(id: string): void {
    this.isLoading = true;
    this.claimService.getClaimById(id).subscribe({
      next: (res) => {
        this.claim = res.claim;
        this.isLoading = false;

        // Pre-fill review form approved amount with claim amount
        this.reviewForm.patchValue({
          approvedAmount: this.claim.claimAmount,
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to retrieve claim details.';
        this.isLoading = false;
      },
    });
  }

  fetchOfficers(): void {
    this.userService.getOfficers().subscribe({
      next: (res) => {
        this.officersList = res.officers;
      },
    });
  }

  onAdditionalFileSelected(event: any): void {
    const files = event.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 5 * 1024 * 1024) {
        this.additionalFiles.push(files[i]);
      } else {
        alert(`File ${files[i].name} exceeds 5MB limit.`);
      }
    }
  }

  removeAdditionalFile(index: number): void {
    this.additionalFiles.splice(index, 1);
  }

  uploadAdditionalDocs(): void {
    if (!this.claim || this.additionalFiles.length === 0) return;

    this.isUploadingDocs = true;
    const formData = new FormData();
    for (const f of this.additionalFiles) {
      formData.append('documents', f, f.name);
    }

    this.claimService.uploadAdditionalDocuments(this.claim.id, formData).subscribe({
      next: () => {
        this.isUploadingDocs = false;
        this.additionalFiles = [];
        this.successMessage = 'Supporting documents uploaded successfully! Claim returned to Under Review status.';
        this.fetchClaim(this.claim!.id);
      },
      error: (err) => {
        this.isUploadingDocs = false;
        this.errorMessage = err.error?.message || 'Failed to upload additional documents.';
      },
    });
  }

  onReviewSubmit(): void {
    if (!this.claim || this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { targetStatus, remarks, approvedAmount, rejectionReason } = this.reviewForm.value;

    if (targetStatus === 'REJECTED' && (!rejectionReason || rejectionReason.trim() === '')) {
      this.errorMessage = 'A detailed rejection reason is strictly required when rejecting a claim.';
      return;
    }

    this.isActionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.claimService
      .updateClaimStatus(this.claim.id, {
        status: targetStatus,
        remarks,
        approvedAmount: targetStatus === 'APPROVED' ? Number(approvedAmount) : undefined,
        rejectionReason: targetStatus === 'REJECTED' ? rejectionReason : undefined,
      })
      .subscribe({
        next: (res) => {
          this.isActionLoading = false;
          this.successMessage = `Claim status transitioned to ${res.claim.status} successfully.`;
          this.fetchClaim(this.claim!.id);
        },
        error: (err) => {
          this.isActionLoading = false;
          this.errorMessage = err.error?.message || 'Failed to update claim status.';
        },
      });
  }

  onAssignSubmit(): void {
    if (!this.claim || this.assignForm.invalid) return;

    const { officerId } = this.assignForm.value;
    this.isActionLoading = true;

    this.claimService.assignOfficer(this.claim.id, officerId).subscribe({
      next: (res) => {
        this.isActionLoading = false;
        this.successMessage = `Claim assigned to ${res.claim.assignedOfficer?.name}.`;
        this.fetchClaim(this.claim!.id);
      },
      error: (err) => {
        this.isActionLoading = false;
        this.errorMessage = err.error?.message || 'Failed to assign officer.';
      },
    });
  }

  viewDocument(docId: string): void {
    window.open(this.claimService.getDocumentViewUrl(docId), '_blank');
  }

  downloadDocument(docId: string): void {
    window.open(this.claimService.getDocumentDownloadUrl(docId), '_blank');
  }
}


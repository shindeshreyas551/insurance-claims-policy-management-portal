import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { ApplicationStatus, PolicyApplication } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss'],
})
export class AdminApplicationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private applicationService = inject(ApplicationService);

  applications: PolicyApplication[] = [];
  selectedApp: PolicyApplication | null = null;
  isLoading = true;
  isProcessing = false;
  errorMessage = '';
  successMessage = '';

  selectedStatusFilter: ApplicationStatus | '' = '';

  reviewForm: FormGroup = this.fb.group({
    status: ['APPROVED', [Validators.required]],
    remarks: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.isLoading = true;
    this.applicationService.getAllApplications({ status: this.selectedStatusFilter }).subscribe({
      next: (res) => {
        this.applications = res.applications;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load applications.';
        this.isLoading = false;
      },
    });
  }

  filterByStatus(status: ApplicationStatus | ''): void {
    this.selectedStatusFilter = status;
    this.fetchApplications();
  }

  openReview(app: PolicyApplication): void {
    this.selectedApp = app;
    this.reviewForm.patchValue({
      status: 'APPROVED',
      remarks: 'Application documents and applicant eligibility verified successfully.',
    });
  }

  closeReview(): void {
    this.selectedApp = null;
  }

  onReviewSubmit(): void {
    if (!this.selectedApp || this.reviewForm.invalid) return;

    this.isProcessing = true;
    const { status, remarks } = this.reviewForm.value;

    this.applicationService.reviewApplication(this.selectedApp.id, { status, remarks }).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.selectedApp = null;
        this.successMessage = res.message;
        this.fetchApplications();
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = err.error?.message || 'Failed to review application.';
      },
    });
  }
}


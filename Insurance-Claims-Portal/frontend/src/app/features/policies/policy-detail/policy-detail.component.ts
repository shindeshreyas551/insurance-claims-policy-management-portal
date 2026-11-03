import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PolicyService } from '../../../core/services/policy.service';
import { AuthService } from '../../../core/services/auth.service';
import { Policy } from '../../../shared/models/policy.model';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss'],
})
export class PolicyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private policyService = inject(PolicyService);
  authService = inject(AuthService);

  policy: Policy | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPolicy(id);
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
        this.errorMessage = err.error?.message || 'Policy details could not be found.';
        this.isLoading = false;
      },
    });
  }
}


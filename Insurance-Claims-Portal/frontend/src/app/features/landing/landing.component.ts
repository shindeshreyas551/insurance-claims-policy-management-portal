import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  authService = inject(AuthService);

  categories = [
    { name: 'Health Insurance', icon: 'medical_services', desc: 'Hospitalization, critical illnesses, and cashless treatments.', count: '2 Plans' },
    { name: 'Life Insurance', icon: 'favorite', desc: 'Pure term protection and child endowment wealth plans.', count: '2 Plans' },
    { name: 'Vehicle Insurance', icon: 'directions_car', desc: 'Comprehensive bumper-to-bumper car & two-wheeler cover.', count: '2 Plans' },
    { name: 'Home Insurance', icon: 'home', desc: 'Structure, fire, flood, burglary and valuable contents shield.', count: '1 Plan' },
    { name: 'Travel Insurance', icon: 'flight_takeoff', desc: 'International and domestic trip cancellation & medical cover.', count: '1 Plan' },
  ];

  workflowSteps = [
    { step: '01', title: 'Choose & Apply', desc: 'Browse curated policies across 5 categories and apply in under 3 minutes.' },
    { step: '02', title: 'Instant Verification', desc: 'Administrative evaluation and instant digital policy issuance with active schedule.' },
    { step: '03', title: 'Seamless Claim Filing', desc: 'Submit claims with incident details and upload hospital or repair invoices securely.' },
    { step: '04', title: 'Officer Assessment', desc: 'Dedicated insurance officers review supporting evidence and recommend approvals.' },
    { step: '05', title: 'Direct Settlement', desc: 'Approved claims are settled promptly via direct electronic fund transfer.' },
  ];
}


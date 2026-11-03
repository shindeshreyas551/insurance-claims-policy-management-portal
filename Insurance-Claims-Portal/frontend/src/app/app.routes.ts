import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CustomerDashboardComponent } from './features/customer/dashboard/customer-dashboard.component';
import { MyPoliciesComponent } from './features/customer/my-policies/my-policies.component';
import { OfficerDashboardComponent } from './features/officer/dashboard/officer-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { AdminPoliciesComponent } from './features/admin/policies/admin-policies.component';
import { AdminApplicationsComponent } from './features/admin/applications/admin-applications.component';
import { UserManagementComponent } from './features/admin/users/user-management.component';
import { AuditLogsComponent } from './features/admin/audit-logs/audit-logs.component';
import { PolicyListComponent } from './features/policies/policy-list/policy-list.component';
import { PolicyDetailComponent } from './features/policies/policy-detail/policy-detail.component';
import { PolicyApplyComponent } from './features/policies/policy-apply/policy-apply.component';
import { ClaimListComponent } from './features/claims/claim-list/claim-list.component';
import { ClaimSubmitComponent } from './features/claims/claim-submit/claim-submit.component';
import { ClaimDetailComponent } from './features/claims/claim-detail/claim-detail.component';
import { ReportsComponent } from './features/reports/reports.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },

      // Policies (Public / Customer)
      { path: 'policies', component: PolicyListComponent },
      { path: 'policies/:id', component: PolicyDetailComponent },
      {
        path: 'policies/:id/apply',
        component: PolicyApplyComponent,
        canActivate: [authGuard],
      },

      // Customer Area
      {
        path: 'customer/dashboard',
        component: CustomerDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['CUSTOMER'] },
      },
      {
        path: 'my-policies',
        component: MyPoliciesComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['CUSTOMER'] },
      },

      // Officer Area
      {
        path: 'officer/dashboard',
        component: OfficerDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['OFFICER'] },
      },

      // Admin Area
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/policies',
        component: AdminPoliciesComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/applications',
        component: AdminApplicationsComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/users',
        component: UserManagementComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/audit-logs',
        component: AuditLogsComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },

      // Claims (Shared across roles with role-based internal controls)
      {
        path: 'claims',
        component: ClaimListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'claims/submit',
        component: ClaimSubmitComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['CUSTOMER'] },
      },
      {
        path: 'claims/:id',
        component: ClaimDetailComponent,
        canActivate: [authGuard],
      },

      // Shared System Tools
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'OFFICER'] },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },

      // 404 Wildcard
      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '404' },
    ],
  },
];

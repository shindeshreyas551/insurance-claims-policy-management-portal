import { Claim } from './claim.model';
import { PolicyApplication } from './policy.model';

export interface CustomerDashboardData {
  stats: {
    activePolicies: number;
    totalClaims: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    settledClaims: number;
    totalClaimedAmount: number;
    totalReceivedAmount: number;
    unreadNotifications: number;
  };
  recentClaims: Claim[];
  recentApplications: PolicyApplication[];
}

export interface OfficerDashboardData {
  stats: {
    totalAssigned: number;
    underReview: number;
    additionalDocsRequired: number;
    approved: number;
    rejected: number;
    unassignedQueueCount: number;
  };
  recentlyProcessed: Claim[];
  unassignedQueue: Claim[];
}

export interface AdminDashboardData {
  stats: {
    totalCustomers: number;
    totalOfficers: number;
    totalPolicies: number;
    activeCustomerPolicies: number;
    totalClaims: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    settledClaims: number;
    totalClaimedAmount: number;
    totalApprovedAmount: number;
    totalSettledAmount: number;
  };
  charts: {
    monthly: {
      labels: string[];
      claimsCounts: number[];
      claimedAmounts: number[];
      settledAmounts: number[];
    };
    statusDistribution: { [key: string]: number };
    categoryDistribution: { [key: string]: number };
  };
  recentClaims: Claim[];
  recentAuditLogs: any[];
}


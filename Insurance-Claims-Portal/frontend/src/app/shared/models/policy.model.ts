export type PolicyCategory = 'HEALTH' | 'LIFE' | 'VEHICLE' | 'HOME' | 'TRAVEL';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type CustomerPolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Policy {
  id: string;
  policyNumber: string;
  name: string;
  category: PolicyCategory;
  description: string;
  premiumAmount: number;
  coverageAmount: number;
  durationMonths: number;
  eligibility: string;
  termsAndConditions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    customerPolicies?: number;
    applications?: number;
  };
}

export interface PolicyApplication {
  id: string;
  applicationNumber: string;
  customerId: string;
  policyId: string;
  status: ApplicationStatus;
  nomineeName: string;
  nomineeRelation: string;
  annualIncome?: number | null;
  existingConditions?: string | null;
  remarks?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  policy?: Policy;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  customerPolicy?: CustomerPolicy;
}

export interface CustomerPolicy {
  id: string;
  policyNumber: string;
  customerId: string;
  policyId: string;
  applicationId?: string | null;
  startDate: string;
  endDate: string;
  premiumPaid: number;
  coverageAmount: number;
  status: CustomerPolicyStatus;
  createdAt: string;
  updatedAt: string;
  policy?: Policy;
  claims?: any[];
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}


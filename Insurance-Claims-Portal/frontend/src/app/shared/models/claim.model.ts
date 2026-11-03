import { CustomerPolicy, Policy } from './policy.model';

export type ClaimStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_DOCS_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SETTLED';

export interface ClaimDocument {
  id: string;
  claimId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ClaimStatusHistory {
  id: string;
  claimId: string;
  previousStatus: ClaimStatus;
  newStatus: ClaimStatus;
  changedById: string;
  remarks?: string | null;
  createdAt: string;
  changedBy?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Claim {
  id: string;
  claimNumber: string;
  customerId: string;
  customerPolicyId: string;
  policyId: string;
  incidentDate: string;
  claimCategory: string;
  claimAmount: number;
  approvedAmount?: number | null;
  description: string;
  status: ClaimStatus;
  assignedOfficerId?: string | null;
  officerRemarks?: string | null;
  rejectionReason?: string | null;
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  policy?: Policy;
  customerPolicy?: CustomerPolicy;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  assignedOfficer?: {
    id: string;
    name: string;
    email: string;
  };
  documents?: ClaimDocument[];
  statusHistory?: ClaimStatusHistory[];
}


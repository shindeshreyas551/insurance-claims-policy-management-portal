export type UserRole = 'ADMIN' | 'OFFICER' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    customerPolicies?: number;
    claims?: number;
    assignedClaims?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}


import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export async function getMyPolicies(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const policies = await prisma.customerPolicy.findMany({
    where: { customerId: req.user.userId },
    include: {
      policy: true,
      claims: {
        select: {
          id: true,
          claimNumber: true,
          claimAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: policies.length, policies });
}

export async function getCustomerPolicyById(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;

  const policy = await prisma.customerPolicy.findUnique({
    where: { id },
    include: {
      policy: true,
      claims: {
        include: {
          documents: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!policy) {
    res.status(404).json({ success: false, message: 'Policy not found.' });
    return;
  }

  // If customer, check ownership
  if (req.user.role === 'CUSTOMER' && policy.customerId !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Forbidden. You do not own this policy.' });
    return;
  }

  res.json({ success: true, customerPolicy: policy });
}

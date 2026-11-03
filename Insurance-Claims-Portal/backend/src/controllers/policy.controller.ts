import { Response } from 'express';
import { z } from 'zod';
import { PolicyCategory, Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { logAuditEvent } from '../utils/auditLogger';

const policySchema = z.object({
  name: z.string().min(3, 'Policy name is required'),
  category: z.nativeEnum(PolicyCategory),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  premiumAmount: z.number().positive('Premium amount must be positive'),
  coverageAmount: z.number().positive('Coverage amount must be positive'),
  durationMonths: z.number().int().positive('Duration must be positive integer'),
  eligibility: z.string().min(5, 'Eligibility criteria required'),
  termsAndConditions: z.string().min(10, 'Terms and conditions required'),
});

export async function listPolicies(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { category, search, activeOnly } = req.query;

  const where: any = {};

  const isAdmin = req.user && req.user.role === Role.ADMIN;
  if (!isAdmin || activeOnly === 'true') {
    where.isActive = true;
  }

  if (category && typeof category === 'string' && Object.values(PolicyCategory).includes(category as PolicyCategory)) {
    where.category = category as PolicyCategory;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { name: { contains: search.trim() } },
      { description: { contains: search.trim() } },
      { policyNumber: { contains: search.trim() } },
    ];
  }

  const policies = await prisma.policy.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: policies.length, policies });
}

export async function getPolicyById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;

  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          customerPolicies: true,
          applications: true,
        },
      },
    },
  });

  if (!policy) {
    res.status(404).json({ success: false, message: 'Insurance policy not found.' });
    return;
  }

  res.json({ success: true, policy });
}

export async function createPolicy(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = policySchema.parse(req.body);

  const prefix = data.category.substring(0, 3).toUpperCase();
  const count = await prisma.policy.count({ where: { category: data.category } });
  const policyNumber = `POL-${prefix}-${String(count + 1).padStart(3, '0')}`;

  const policy = await prisma.policy.create({
    data: {
      policyNumber,
      name: data.name,
      category: data.category,
      description: data.description,
      premiumAmount: data.premiumAmount,
      coverageAmount: data.coverageAmount,
      durationMonths: data.durationMonths,
      eligibility: data.eligibility,
      termsAndConditions: data.termsAndConditions,
      isActive: true,
    },
  });

  await logAuditEvent(
    req.user?.userId || null,
    'CREATE_POLICY',
    'Policy',
    policy.id,
    `Created policy ${policy.policyNumber}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.status(201).json({
    success: true,
    message: 'Insurance policy created successfully.',
    policy,
  });
}

export async function updatePolicy(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const data = policySchema.partial().parse(req.body);

  const existing = await prisma.policy.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Policy not found.' });
    return;
  }

  const updated = await prisma.policy.update({
    where: { id },
    data,
  });

  await logAuditEvent(
    req.user?.userId || null,
    'UPDATE_POLICY',
    'Policy',
    id,
    `Updated policy ${updated.policyNumber}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.json({
    success: true,
    message: 'Policy updated successfully.',
    policy: updated,
  });
}

export async function togglePolicyStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;

  const existing = await prisma.policy.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Policy not found.' });
    return;
  }

  const updated = await prisma.policy.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  await logAuditEvent(
    req.user?.userId || null,
    'TOGGLE_POLICY_STATUS',
    'Policy',
    id,
    `Toggled policy ${updated.policyNumber} active status to ${updated.isActive}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.json({
    success: true,
    message: `Policy ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
    policy: updated,
  });
}

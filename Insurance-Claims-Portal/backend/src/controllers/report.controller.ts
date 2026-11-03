import { Response } from 'express';
import { ClaimStatus, PolicyCategory } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export async function getClaimsReport(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { startDate, endDate, category, status, officerId, search } = req.query;

  const where: any = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (category && typeof category === 'string' && Object.values(PolicyCategory).includes(category as PolicyCategory)) {
    where.claimCategory = category;
  }

  if (status && typeof status === 'string' && Object.values(ClaimStatus).includes(status as ClaimStatus)) {
    where.status = status as ClaimStatus;
  }

  if (officerId && typeof officerId === 'string') {
    where.assignedOfficerId = officerId;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { claimNumber: { contains: search.trim() } },
      { customer: { name: { contains: search.trim() } } },
      { customer: { email: { contains: search.trim() } } },
      { customerPolicy: { policyNumber: { contains: search.trim() } } },
    ];
  }

  const claims = await prisma.claim.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      policy: true,
      customerPolicy: true,
      assignedOfficer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const summary = {
    totalRecords: claims.length,
    totalClaimedAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
    totalApprovedAmount: claims
      .filter((c) => [ClaimStatus.APPROVED, ClaimStatus.SETTLED].includes(c.status as any))
      .reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0),
    totalSettledAmount: claims
      .filter((c) => c.status === ClaimStatus.SETTLED)
      .reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0),
  };

  res.json({
    success: true,
    summary,
    claims,
  });
}

export async function exportClaimsCSV(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { startDate, endDate, category, status, officerId, search } = req.query;

  const where: any = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (category && typeof category === 'string' && Object.values(PolicyCategory).includes(category as PolicyCategory)) {
    where.claimCategory = category;
  }

  if (status && typeof status === 'string' && Object.values(ClaimStatus).includes(status as ClaimStatus)) {
    where.status = status as ClaimStatus;
  }

  if (officerId && typeof officerId === 'string') {
    where.assignedOfficerId = officerId;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { claimNumber: { contains: search.trim() } },
      { customer: { name: { contains: search.trim() } } },
      { customer: { email: { contains: search.trim() } } },
    ];
  }

  const claims = await prisma.claim.findMany({
    where,
    include: {
      customer: true,
      policy: true,
      customerPolicy: true,
      assignedOfficer: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Claim Number',
    'Customer Name',
    'Customer Email',
    'Policy Name',
    'Category',
    'Customer Policy No',
    'Incident Date',
    'Claim Amount (INR)',
    'Approved Amount (INR)',
    'Status',
    'Assigned Officer',
    'Officer Remarks',
    'Rejection Reason',
    'Submission Date',
    'Settled Date',
  ];

  const escapeCSV = (field: any) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = claims.map((c) => [
    escapeCSV(c.claimNumber),
    escapeCSV(c.customer.name),
    escapeCSV(c.customer.email),
    escapeCSV(c.policy.name),
    escapeCSV(c.claimCategory),
    escapeCSV(c.customerPolicy.policyNumber),
    escapeCSV(c.incidentDate.toISOString().split('T')[0]),
    escapeCSV(c.claimAmount),
    escapeCSV(c.approvedAmount || 0),
    escapeCSV(c.status),
    escapeCSV(c.assignedOfficer?.name || 'Unassigned'),
    escapeCSV(c.officerRemarks || ''),
    escapeCSV(c.rejectionReason || ''),
    escapeCSV(c.createdAt.toISOString().split('T')[0]),
    escapeCSV(c.settledAt ? c.settledAt.toISOString().split('T')[0] : 'N/A'),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="insurance_claims_report_${Date.now()}.csv"`);
  res.status(200).send(csvContent);
}

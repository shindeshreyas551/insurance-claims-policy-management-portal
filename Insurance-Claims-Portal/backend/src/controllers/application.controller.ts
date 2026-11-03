import { Response } from 'express';
import { z } from 'zod';
import { ApplicationStatus, CustomerPolicyStatus, NotificationType, Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { logAuditEvent } from '../utils/auditLogger';
import { createNotification } from '../utils/notificationHelper';

const applySchema = z.object({
  policyId: z.string().uuid('Invalid policy ID'),
  nomineeName: z.string().min(2, 'Nominee name is required'),
  nomineeRelation: z.string().min(2, 'Nominee relation is required'),
  annualIncome: z.number().positive().optional(),
  existingConditions: z.string().optional(),
  remarks: z.string().optional(),
});

const reviewSchema = z.object({
  status: z.enum([ApplicationStatus.APPROVED, ApplicationStatus.REJECTED]),
  remarks: z.string().optional(),
});

export async function submitApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const data = applySchema.parse(req.body);

  const policy = await prisma.policy.findUnique({
    where: { id: data.policyId },
  });

  if (!policy || !policy.isActive) {
    res.status(400).json({ success: false, message: 'The selected policy is currently not available for application.' });
    return;
  }

  const count = await prisma.policyApplication.count();
  const year = new Date().getFullYear();
  const applicationNumber = `APP-${year}-${String(count + 1).padStart(4, '0')}`;

  const application = await prisma.policyApplication.create({
    data: {
      applicationNumber,
      customerId: req.user.userId,
      policyId: data.policyId,
      nomineeName: data.nomineeName,
      nomineeRelation: data.nomineeRelation,
      annualIncome: data.annualIncome || null,
      existingConditions: data.existingConditions || null,
      remarks: data.remarks || null,
      status: ApplicationStatus.PENDING,
    },
    include: {
      policy: true,
    },
  });

  await logAuditEvent(
    req.user.userId,
    'SUBMIT_APPLICATION',
    'PolicyApplication',
    application.id,
    `Submitted application ${application.applicationNumber} for ${policy.name}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  // Notify Admins
  const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'New Policy Application',
      `Customer ${req.user.name} submitted application ${application.applicationNumber} for ${policy.name}.`,
      NotificationType.INFO,
      '/admin/applications'
    );
  }

  res.status(201).json({
    success: true,
    message: 'Policy application submitted successfully. An administrator will review your application.',
    application,
  });
}

export async function getCustomerApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const applications = await prisma.policyApplication.findMany({
    where: { customerId: req.user.userId },
    include: {
      policy: true,
      customerPolicy: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: applications.length, applications });
}

export async function getAllApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { status, search } = req.query;

  const where: any = {};
  if (status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
    where.status = status as ApplicationStatus;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { applicationNumber: { contains: search.trim() } },
      { customer: { name: { contains: search.trim() } } },
      { customer: { email: { contains: search.trim() } } },
      { policy: { name: { contains: search.trim() } } },
    ];
  }

  const applications = await prisma.policyApplication.findMany({
    where,
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      policy: true,
      reviewedBy: {
        select: { id: true, name: true, email: true },
      },
      customerPolicy: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: applications.length, applications });
}

export async function reviewApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;
  const data = reviewSchema.parse(req.body);

  const application = await prisma.policyApplication.findUnique({
    where: { id },
    include: {
      policy: true,
      customer: true,
    },
  });

  if (!application) {
    res.status(404).json({ success: false, message: 'Application not found.' });
    return;
  }

  if (application.status !== ApplicationStatus.PENDING) {
    res.status(400).json({
      success: false,
      message: `Cannot review this application. Current status is already ${application.status}.`,
    });
    return;
  }

  let customerPolicy = null;

  if (data.status === ApplicationStatus.APPROVED) {
    const prefix = application.policy.category.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const policyNumber = `CP-${prefix}-${year}-${randomSuffix}`;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + application.policy.durationMonths);

    customerPolicy = await prisma.customerPolicy.create({
      data: {
        policyNumber,
        customerId: application.customerId,
        policyId: application.policyId,
        applicationId: application.id,
        startDate,
        endDate,
        premiumPaid: application.policy.premiumAmount,
        coverageAmount: application.policy.coverageAmount,
        status: CustomerPolicyStatus.ACTIVE,
      },
    });
  }

  const updatedApplication = await prisma.policyApplication.update({
    where: { id },
    data: {
      status: data.status,
      remarks: data.remarks || application.remarks,
      reviewedById: req.user.userId,
      reviewedAt: new Date(),
    },
    include: {
      policy: true,
      customer: {
        select: { id: true, name: true, email: true },
      },
      customerPolicy: true,
    },
  });

  await logAuditEvent(
    req.user.userId,
    'REVIEW_APPLICATION',
    'PolicyApplication',
    id,
    `Admin reviewed application ${application.applicationNumber}: ${data.status}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  // Send Notification to Customer
  const isApproved = data.status === ApplicationStatus.APPROVED;
  await createNotification(
    application.customerId,
    isApproved ? 'Policy Application Approved!' : 'Policy Application Update',
    isApproved
      ? `Congratulations! Your application for "${application.policy.name}" has been approved. Active Policy Number: ${customerPolicy?.policyNumber}.`
      : `Your application for "${application.policy.name}" was not approved. Remarks: ${data.remarks || 'Criteria not met.'}`,
    isApproved ? NotificationType.SUCCESS : NotificationType.WARNING,
    isApproved ? '/my-policies' : '/policies/applications'
  );

  res.json({
    success: true,
    message: `Application ${data.status.toLowerCase()} successfully.`,
    application: updatedApplication,
    customerPolicy,
  });
}

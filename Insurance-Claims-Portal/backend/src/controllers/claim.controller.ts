import { Response } from 'express';
import { z } from 'zod';
import { ClaimStatus, CustomerPolicyStatus, NotificationType, Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { logAuditEvent } from '../utils/auditLogger';
import { createNotification } from '../utils/notificationHelper';

const submitClaimSchema = z.object({
  customerPolicyId: z.string().uuid('Valid customer policy ID required'),
  incidentDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid incident date required'),
  claimAmount: z.string().or(z.number()).transform((val) => Number(val)),
  description: z.string().min(15, 'Incident description must be at least 15 characters long'),
});

const updateClaimStatusSchema = z.object({
  status: z.nativeEnum(ClaimStatus),
  remarks: z.string().min(3, 'Remarks are required for status update'),
  approvedAmount: z.number().positive().optional(),
  rejectionReason: z.string().optional(),
});

const assignOfficerSchema = z.object({
  officerId: z.string().uuid('Valid officer ID required'),
});

export async function submitClaim(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const data = submitClaimSchema.parse(req.body);

  if (isNaN(data.claimAmount) || data.claimAmount <= 0) {
    res.status(400).json({ success: false, message: 'Claim amount must be a positive number.' });
    return;
  }

  // 1. Verify Customer Policy exists, belongs to user, and is ACTIVE
  const customerPolicy = await prisma.customerPolicy.findUnique({
    where: { id: data.customerPolicyId },
    include: { policy: true },
  });

  if (!customerPolicy) {
    res.status(404).json({ success: false, message: 'Customer policy not found.' });
    return;
  }

  if (customerPolicy.customerId !== req.user.userId && req.user.role === Role.CUSTOMER) {
    res.status(403).json({ success: false, message: 'You can only file claims against your own policies.' });
    return;
  }

  if (customerPolicy.status !== CustomerPolicyStatus.ACTIVE) {
    res.status(400).json({
      success: false,
      message: `Cannot file claim. Policy is currently ${customerPolicy.status}. Only ACTIVE policies are eligible.`,
    });
    return;
  }

  // 2. Incident date validation
  const incidentDateObj = new Date(data.incidentDate);
  const now = new Date();
  if (incidentDateObj > now) {
    res.status(400).json({ success: false, message: 'Incident date cannot be in the future.' });
    return;
  }

  if (incidentDateObj < customerPolicy.startDate) {
    res.status(400).json({
      success: false,
      message: `Incident date cannot be earlier than policy inception date (${customerPolicy.startDate.toISOString().split('T')[0]}).`,
    });
    return;
  }

  if (incidentDateObj > customerPolicy.endDate) {
    res.status(400).json({
      success: false,
      message: `Incident date is after policy expiry date (${customerPolicy.endDate.toISOString().split('T')[0]}).`,
    });
    return;
  }

  // 3. Claim amount validation: cannot exceed coverage limit
  if (data.claimAmount > customerPolicy.coverageAmount) {
    res.status(400).json({
      success: false,
      message: `Claim amount (₹${data.claimAmount.toLocaleString()}) cannot exceed the policy coverage limit of ₹${customerPolicy.coverageAmount.toLocaleString()}.`,
    });
    return;
  }

  // 4. Duplicate claim prevention (same policy and incident date)
  const existingClaimSameDate = await prisma.claim.findFirst({
    where: {
      customerPolicyId: data.customerPolicyId,
      incidentDate: incidentDateObj,
      status: { notIn: [ClaimStatus.REJECTED] },
    },
  });

  if (existingClaimSameDate) {
    res.status(409).json({
      success: false,
      message: `A claim (${existingClaimSameDate.claimNumber}) is already registered for this policy on the same incident date.`,
    });
    return;
  }

  // 5. Generate Claim Number: CLM-YYYY-XXXX
  const count = await prisma.claim.count();
  const year = new Date().getFullYear();
  const claimNumber = `CLM-${year}-${String(count + 1).padStart(4, '0')}`;

  // 6. Create Claim Record
  const claim = await prisma.claim.create({
    data: {
      claimNumber,
      customerId: req.user.userId,
      customerPolicyId: customerPolicy.id,
      policyId: customerPolicy.policyId,
      incidentDate: incidentDateObj,
      claimCategory: customerPolicy.policy.category,
      claimAmount: data.claimAmount,
      description: data.description,
      status: ClaimStatus.SUBMITTED,
    },
  });

  // 7. Record Initial Status in History
  await prisma.claimStatusHistory.create({
    data: {
      claimId: claim.id,
      previousStatus: ClaimStatus.SUBMITTED,
      newStatus: ClaimStatus.SUBMITTED,
      changedById: req.user.userId,
      remarks: 'Initial claim submission by customer.',
    },
  });

  // 8. Process Uploaded Documents if any
  const files = req.files as Express.Multer.File[] | undefined;
  if (files && files.length > 0) {
    for (const file of files) {
      await prisma.claimDocument.create({
        data: {
          claimId: claim.id,
          fileName: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          mimeType: file.mimetype,
          fileSize: file.size,
          uploadedBy: req.user.userId,
        },
      });
    }
  }

  // 9. Audit Logging
  await logAuditEvent(
    req.user.userId,
    'SUBMIT_CLAIM',
    'Claim',
    claim.id,
    `Submitted claim ${claimNumber} for amount ₹${data.claimAmount}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  // 10. Notify Customer and Officers/Admins
  await createNotification(
    req.user.userId,
    'Claim Submitted Successfully',
    `Your claim ${claimNumber} for ₹${data.claimAmount.toLocaleString()} has been received and is awaiting officer assignment.`,
    NotificationType.INFO,
    `/claims/${claim.id}`
  );

  const officersAndAdmins = await prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.OFFICER] } },
  });
  for (const staff of officersAndAdmins) {
    await createNotification(
      staff.id,
      'New Insurance Claim Submitted',
      `Claim ${claimNumber} submitted by ${req.user.name} for ${customerPolicy.policy.name} (Amount: ₹${data.claimAmount.toLocaleString()}).`,
      NotificationType.INFO,
      `/claims/${claim.id}`
    );
  }

  const completeClaim = await prisma.claim.findUnique({
    where: { id: claim.id },
    include: {
      policy: true,
      customerPolicy: true,
      documents: true,
      statusHistory: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Claim submitted successfully.',
    claim: completeClaim,
  });
}

export async function listClaims(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { status, category, search } = req.query;
  const where: any = {};

  // Role based filtering
  if (req.user.role === Role.CUSTOMER) {
    where.customerId = req.user.userId;
  } else if (req.user.role === Role.OFFICER) {
    if (req.query.assignedOnly === 'true') {
      where.assignedOfficerId = req.user.userId;
    }
  }

  if (status && Object.values(ClaimStatus).includes(status as ClaimStatus)) {
    where.status = status as ClaimStatus;
  }

  if (category && typeof category === 'string') {
    where.claimCategory = category;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { claimNumber: { contains: search.trim() } },
      { description: { contains: search.trim() } },
      { customer: { name: { contains: search.trim() } } },
      { policy: { name: { contains: search.trim() } } },
    ];
  }

  const claims = await prisma.claim.findMany({
    where,
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      policy: true,
      customerPolicy: true,
      assignedOfficer: {
        select: { id: true, name: true, email: true },
      },
      documents: true,
      statusHistory: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: claims.length, claims });
}

export async function getClaimById(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;

  const claim = await prisma.claim.findFirst({
    where: {
      OR: [{ id }, { claimNumber: id }],
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true, address: true },
      },
      policy: true,
      customerPolicy: true,
      assignedOfficer: {
        select: { id: true, name: true, email: true },
      },
      documents: true,
      statusHistory: {
        include: {
          changedBy: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!claim) {
    res.status(404).json({ success: false, message: 'Claim not found.' });
    return;
  }

  // Customer authorization check
  if (req.user.role === Role.CUSTOMER && claim.customerId !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Forbidden. You do not have access to this claim.' });
    return;
  }

  res.json({ success: true, claim });
}

export async function updateClaimStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;
  const data = updateClaimStatusSchema.parse(req.body);

  const claim = await prisma.claim.findUnique({
    where: { id },
    include: { customer: true, policy: true, customerPolicy: true },
  });

  if (!claim) {
    res.status(404).json({ success: false, message: 'Claim not found.' });
    return;
  }

  const currentStatus = claim.status;
  const nextStatus = data.status;

  // Enforce Status Workflow Rules:
  if (nextStatus === ClaimStatus.REJECTED && (!data.rejectionReason || data.rejectionReason.trim() === '')) {
    res.status(400).json({ success: false, message: 'A detailed rejection reason is mandatory when rejecting a claim.' });
    return;
  }

  if (nextStatus === ClaimStatus.SETTLED && currentStatus !== ClaimStatus.APPROVED) {
    res.status(400).json({
      success: false,
      message: `A claim can only be marked SETTLED after it has been APPROVED. Current status is ${currentStatus}.`,
    });
    return;
  }

  if (req.user.role === Role.OFFICER) {
    if (nextStatus === ClaimStatus.SETTLED) {
      res.status(403).json({ success: false, message: 'Only Administrators have permission to finalize claim settlement.' });
      return;
    }
  }

  let finalApprovedAmount = claim.approvedAmount;
  if (nextStatus === ClaimStatus.APPROVED) {
    finalApprovedAmount = data.approvedAmount ?? claim.claimAmount;
    if (finalApprovedAmount <= 0) {
      res.status(400).json({ success: false, message: 'Approved amount must be greater than zero.' });
      return;
    }
    if (finalApprovedAmount > claim.customerPolicy.coverageAmount) {
      res.status(400).json({
        success: false,
        message: `Approved amount cannot exceed the policy coverage limit of ₹${claim.customerPolicy.coverageAmount.toLocaleString()}.`,
      });
      return;
    }
  }

  const updateData: any = {
    status: nextStatus,
    officerRemarks: data.remarks,
    ...(nextStatus === ClaimStatus.APPROVED && { approvedAmount: finalApprovedAmount }),
    ...(nextStatus === ClaimStatus.REJECTED && { rejectionReason: data.rejectionReason }),
    ...(nextStatus === ClaimStatus.SETTLED && { settledAt: new Date() }),
  };

  if (req.user.role === Role.OFFICER && !claim.assignedOfficerId) {
    updateData.assignedOfficerId = req.user.userId;
  }

  const updatedClaim = await prisma.claim.update({
    where: { id },
    data: updateData,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      policy: true,
      assignedOfficer: { select: { id: true, name: true } },
    },
  });

  await prisma.claimStatusHistory.create({
    data: {
      claimId: id,
      previousStatus: currentStatus,
      newStatus: nextStatus,
      changedById: req.user.userId,
      remarks: data.remarks + (data.rejectionReason ? ` Reason: ${data.rejectionReason}` : ''),
    },
  });

  await logAuditEvent(
    req.user.userId,
    'UPDATE_CLAIM_STATUS',
    'Claim',
    id,
    `Status transitioned from ${currentStatus} to ${nextStatus}. Remarks: ${data.remarks}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  let notificationTitle = `Claim Status: ${nextStatus.replace(/_/g, ' ')}`;
  let notificationType: NotificationType = NotificationType.INFO;
  let notificationMsg = `Claim ${claim.claimNumber} status updated to ${nextStatus.replace(/_/g, ' ')}. Remarks: ${data.remarks}`;

  if (nextStatus === ClaimStatus.APPROVED) {
    notificationTitle = '🎉 Claim Approved!';
    notificationType = NotificationType.SUCCESS;
    notificationMsg = `Great news! Claim ${claim.claimNumber} has been approved for ₹${(finalApprovedAmount || claim.claimAmount).toLocaleString()}.`;
  } else if (nextStatus === ClaimStatus.REJECTED) {
    notificationTitle = 'Claim Rejected';
    notificationType = NotificationType.ERROR;
    notificationMsg = `Claim ${claim.claimNumber} was rejected. Reason: ${data.rejectionReason}`;
  } else if (nextStatus === ClaimStatus.ADDITIONAL_DOCS_REQUIRED) {
    notificationTitle = 'Action Required: Additional Documents Requested';
    notificationType = NotificationType.WARNING;
    notificationMsg = `Verification officer requested additional supporting documents for ${claim.claimNumber}. ${data.remarks}`;
  } else if (nextStatus === ClaimStatus.SETTLED) {
    notificationTitle = '💰 Claim Settled & Funds Transferred';
    notificationType = NotificationType.SUCCESS;
    notificationMsg = `Claim ${claim.claimNumber} has been successfully settled for ₹${(claim.approvedAmount || claim.claimAmount).toLocaleString()}. Funds have been dispatched.`;
  }

  await createNotification(claim.customerId, notificationTitle, notificationMsg, notificationType, `/claims/${claim.id}`);

  res.json({
    success: true,
    message: `Claim status successfully updated to ${nextStatus}.`,
    claim: updatedClaim,
  });
}

export async function assignOfficer(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;
  const data = assignOfficerSchema.parse(req.body);

  const officer = await prisma.user.findFirst({
    where: { id: data.officerId, role: Role.OFFICER, isActive: true },
  });

  if (!officer) {
    res.status(404).json({ success: false, message: 'Officer not found or is inactive.' });
    return;
  }

  const claim = await prisma.claim.findUnique({ where: { id } });
  if (!claim) {
    res.status(404).json({ success: false, message: 'Claim not found.' });
    return;
  }

  const updatedClaim = await prisma.claim.update({
    where: { id },
    data: {
      assignedOfficerId: officer.id,
      ...(claim.status === ClaimStatus.SUBMITTED && { status: ClaimStatus.UNDER_REVIEW }),
    },
    include: {
      assignedOfficer: { select: { id: true, name: true, email: true } },
    },
  });

  if (claim.status === ClaimStatus.SUBMITTED) {
    await prisma.claimStatusHistory.create({
      data: {
        claimId: id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: req.user.userId,
        remarks: `Claim assigned to Officer ${officer.name}. Review underway.`,
      },
    });
  }

  await logAuditEvent(
    req.user.userId,
    'ASSIGN_OFFICER',
    'Claim',
    id,
    `Assigned claim ${claim.claimNumber} to officer ${officer.name}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  await createNotification(
    officer.id,
    'New Claim Assigned For Review',
    `Claim ${claim.claimNumber} has been assigned to you for investigation and assessment.`,
    NotificationType.INFO,
    `/officer/claims/${claim.id}`
  );

  res.json({
    success: true,
    message: `Claim assigned to Officer ${officer.name}.`,
    claim: updatedClaim,
  });
}

export async function uploadAdditionalDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;
  const claim = await prisma.claim.findUnique({
    where: { id },
    include: { assignedOfficer: true },
  });

  if (!claim) {
    res.status(404).json({ success: false, message: 'Claim not found.' });
    return;
  }

  if (req.user.role === Role.CUSTOMER && claim.customerId !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Forbidden. You do not own this claim.' });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ success: false, message: 'No documents were uploaded.' });
    return;
  }

  const createdDocs = [];
  for (const file of files) {
    const doc = await prisma.claimDocument.create({
      data: {
        claimId: id,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: req.user.userId,
      },
    });
    createdDocs.push(doc);
  }

  if (claim.status === ClaimStatus.ADDITIONAL_DOCS_REQUIRED) {
    await prisma.claim.update({
      where: { id },
      data: { status: ClaimStatus.UNDER_REVIEW },
    });

    await prisma.claimStatusHistory.create({
      data: {
        claimId: id,
        previousStatus: ClaimStatus.ADDITIONAL_DOCS_REQUIRED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: req.user.userId,
        remarks: `Customer uploaded ${files.length} requested additional document(s). Under review.`,
      },
    });

    if (claim.assignedOfficerId) {
      await createNotification(
        claim.assignedOfficerId,
        'Additional Documents Uploaded',
        `Customer uploaded ${files.length} document(s) for claim ${claim.claimNumber}. Ready for continued verification.`,
        NotificationType.INFO,
        `/officer/claims/${claim.id}`
      );
    }
  }

  await logAuditEvent(
    req.user.userId,
    'UPLOAD_DOCUMENTS',
    'Claim',
    id,
    `Uploaded ${files.length} additional documents for claim ${claim.claimNumber}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.json({
    success: true,
    message: `${files.length} document(s) uploaded successfully.`,
    documents: createdDocs,
  });
}

import { Response } from 'express';
import { ClaimStatus, CustomerPolicyStatus, Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export async function getCustomerDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  // Active policies count
  const activePoliciesCount = await prisma.customerPolicy.count({
    where: { customerId: userId, status: CustomerPolicyStatus.ACTIVE },
  });

  // Claims counts
  const allClaims = await prisma.claim.findMany({
    where: { customerId: userId },
    select: {
      id: true,
      claimNumber: true,
      claimCategory: true,
      claimAmount: true,
      approvedAmount: true,
      status: true,
      createdAt: true,
      incidentDate: true,
      policy: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalClaims = allClaims.length;
  const pendingClaims = allClaims.filter((c) =>
    [ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.ADDITIONAL_DOCS_REQUIRED].includes(c.status as any)
  ).length;
  const approvedClaims = allClaims.filter((c) => c.status === ClaimStatus.APPROVED).length;
  const rejectedClaims = allClaims.filter((c) => c.status === ClaimStatus.REJECTED).length;
  const settledClaims = allClaims.filter((c) => c.status === ClaimStatus.SETTLED).length;

  const totalClaimedAmount = allClaims.reduce((acc, curr) => acc + curr.claimAmount, 0);
  const totalReceivedAmount = allClaims
    .filter((c) => c.status === ClaimStatus.SETTLED)
    .reduce((acc, curr) => acc + (curr.approvedAmount || curr.claimAmount), 0);

  // Recent applications
  const recentApplications = await prisma.policyApplication.findMany({
    where: { customerId: userId },
    include: { policy: true },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  // Unread notifications count
  const unreadNotifications = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  res.json({
    success: true,
    data: {
      stats: {
        activePolicies: activePoliciesCount,
        totalClaims,
        pendingClaims,
        approvedClaims,
        rejectedClaims,
        settledClaims,
        totalClaimedAmount,
        totalReceivedAmount,
        unreadNotifications,
      },
      recentClaims: allClaims.slice(0, 5),
      recentApplications,
    },
  });
}

export async function getOfficerDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const officerId = req.user.userId;

  const assignedClaims = await prisma.claim.findMany({
    where: { assignedOfficerId: officerId },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      policy: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const unassignedClaims = await prisma.claim.findMany({
    where: { assignedOfficerId: null, status: ClaimStatus.SUBMITTED },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      policy: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalAssigned = assignedClaims.length;
  const underReview = assignedClaims.filter((c) => c.status === ClaimStatus.UNDER_REVIEW).length;
  const additionalDocsRequired = assignedClaims.filter((c) => c.status === ClaimStatus.ADDITIONAL_DOCS_REQUIRED).length;
  const approved = assignedClaims.filter((c) => [ClaimStatus.APPROVED, ClaimStatus.SETTLED].includes(c.status as any)).length;
  const rejected = assignedClaims.filter((c) => c.status === ClaimStatus.REJECTED).length;

  res.json({
    success: true,
    data: {
      stats: {
        totalAssigned,
        underReview,
        additionalDocsRequired,
        approved,
        rejected,
        unassignedQueueCount: unassignedClaims.length,
      },
      recentlyProcessed: assignedClaims.slice(0, 6),
      unassignedQueue: unassignedClaims.slice(0, 5),
    },
  });
}

export async function getAdminDashboard(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const [
    totalCustomers,
    totalOfficers,
    totalPolicies,
    activePoliciesCount,
    allClaims,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.user.count({ where: { role: Role.OFFICER } }),
    prisma.policy.count(),
    prisma.customerPolicy.count({ where: { status: CustomerPolicyStatus.ACTIVE } }),
    prisma.claim.findMany({
      include: {
        policy: { select: { category: true, name: true } },
        customer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, role: true } } },
    }),
  ]);

  const totalClaims = allClaims.length;
  const pendingClaims = allClaims.filter((c) =>
    [ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.ADDITIONAL_DOCS_REQUIRED].includes(c.status as any)
  ).length;
  const approvedClaims = allClaims.filter((c) => c.status === ClaimStatus.APPROVED).length;
  const rejectedClaims = allClaims.filter((c) => c.status === ClaimStatus.REJECTED).length;
  const settledClaims = allClaims.filter((c) => c.status === ClaimStatus.SETTLED).length;

  const totalClaimedAmount = allClaims.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalApprovedAmount = allClaims
    .filter((c) => [ClaimStatus.APPROVED, ClaimStatus.SETTLED].includes(c.status as any))
    .reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0);
  const totalSettledAmount = allClaims
    .filter((c) => c.status === ClaimStatus.SETTLED)
    .reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyDataMap: { [key: string]: { claimsCount: number; claimedAmount: number; settledAmount: number } } = {};

  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyDataMap[key] = { claimsCount: 0, claimedAmount: 0, settledAmount: 0 };
  }

  for (const c of allClaims) {
    const d = new Date(c.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyDataMap[key]) {
      monthlyDataMap[key].claimsCount += 1;
      monthlyDataMap[key].claimedAmount += c.claimAmount;
      if (c.status === ClaimStatus.SETTLED) {
        monthlyDataMap[key].settledAmount += c.approvedAmount || c.claimAmount;
      }
    }
  }

  const monthlyLabels = Object.keys(monthlyDataMap);
  const monthlyClaimsCounts = monthlyLabels.map((k) => monthlyDataMap[k].claimsCount);
  const monthlyClaimedAmounts = monthlyLabels.map((k) => monthlyDataMap[k].claimedAmount);
  const monthlySettledAmounts = monthlyLabels.map((k) => monthlyDataMap[k].settledAmount);

  const statusDistribution = {
    [ClaimStatus.SUBMITTED]: allClaims.filter((c) => c.status === ClaimStatus.SUBMITTED).length,
    [ClaimStatus.UNDER_REVIEW]: allClaims.filter((c) => c.status === ClaimStatus.UNDER_REVIEW).length,
    [ClaimStatus.ADDITIONAL_DOCS_REQUIRED]: allClaims.filter((c) => c.status === ClaimStatus.ADDITIONAL_DOCS_REQUIRED).length,
    [ClaimStatus.APPROVED]: approvedClaims,
    [ClaimStatus.REJECTED]: rejectedClaims,
    [ClaimStatus.SETTLED]: settledClaims,
  };

  const categoryCountMap: { [key: string]: number } = {};
  for (const c of allClaims) {
    const cat = c.claimCategory;
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  }

  res.json({
    success: true,
    data: {
      stats: {
        totalCustomers,
        totalOfficers,
        totalPolicies,
        activeCustomerPolicies: activePoliciesCount,
        totalClaims,
        pendingClaims,
        approvedClaims,
        rejectedClaims,
        settledClaims,
        totalClaimedAmount,
        totalApprovedAmount,
        totalSettledAmount,
      },
      charts: {
        monthly: {
          labels: monthlyLabels,
          claimsCounts: monthlyClaimsCounts,
          claimedAmounts: monthlyClaimedAmounts,
          settledAmounts: monthlySettledAmounts,
        },
        statusDistribution,
        categoryDistribution: categoryCountMap,
      },
      recentClaims: allClaims.slice(0, 6),
      recentAuditLogs,
    },
  });
}

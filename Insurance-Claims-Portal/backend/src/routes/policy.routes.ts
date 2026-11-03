import { Router } from 'express';
import { Role } from '@prisma/client';
import { listPolicies, getPolicyById, createPolicy, updatePolicy, togglePolicyStatus } from '../controllers/policy.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public / Browsable policies (optional auth)
router.get('/', listPolicies);
router.get('/:id', getPolicyById);

// Admin-only management routes
router.post('/', authenticate, authorizeRoles(Role.ADMIN), createPolicy);
router.put('/:id', authenticate, authorizeRoles(Role.ADMIN), updatePolicy);
router.patch('/:id/toggle-status', authenticate, authorizeRoles(Role.ADMIN), togglePolicyStatus);

export default router;


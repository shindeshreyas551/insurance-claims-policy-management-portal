import { Router } from 'express';
import { Role } from '@prisma/client';
import { listUsers, getOfficers, toggleUserStatus, createUser, getAuditLogs } from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/officers', authenticate, authorizeRoles(Role.ADMIN, Role.OFFICER), getOfficers);
router.get('/', authenticate, authorizeRoles(Role.ADMIN), listUsers);
router.post('/', authenticate, authorizeRoles(Role.ADMIN), createUser);
router.patch('/:id/toggle-status', authenticate, authorizeRoles(Role.ADMIN), toggleUserStatus);
router.get('/audit-logs', authenticate, authorizeRoles(Role.ADMIN), getAuditLogs);

export default router;


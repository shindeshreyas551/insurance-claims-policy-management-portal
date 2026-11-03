import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getCustomerDashboard,
  getOfficerDashboard,
  getAdminDashboard,
} from '../controllers/dashboard.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/customer', authenticate, authorizeRoles(Role.CUSTOMER), getCustomerDashboard);
router.get('/officer', authenticate, authorizeRoles(Role.OFFICER), getOfficerDashboard);
router.get('/admin', authenticate, authorizeRoles(Role.ADMIN), getAdminDashboard);

export default router;


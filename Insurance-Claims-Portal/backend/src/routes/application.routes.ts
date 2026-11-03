import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  submitApplication,
  getCustomerApplications,
  getAllApplications,
  reviewApplication,
} from '../controllers/application.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Customer routes
router.post('/apply', authenticate, authorizeRoles(Role.CUSTOMER), submitApplication);
router.get('/my-applications', authenticate, authorizeRoles(Role.CUSTOMER), getCustomerApplications);

// Admin review & listing routes
router.get('/all', authenticate, authorizeRoles(Role.ADMIN), getAllApplications);
router.patch('/:id/review', authenticate, authorizeRoles(Role.ADMIN), reviewApplication);

export default router;


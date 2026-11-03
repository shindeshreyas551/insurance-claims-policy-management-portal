import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  submitClaim,
  listClaims,
  getClaimById,
  updateClaimStatus,
  assignOfficer,
  uploadAdditionalDocuments,
} from '../controllers/claim.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// List & view claims (authorized based on role in controller)
router.get('/', authenticate, listClaims);
router.get('/:id', authenticate, getClaimById);

// Submit claim (Customer) with up to 5 documents
router.post(
  '/submit',
  authenticate,
  authorizeRoles(Role.CUSTOMER),
  uploadMiddleware.array('documents', 5),
  submitClaim
);

// Upload additional requested documents (Customer)
router.post(
  '/:id/upload-documents',
  authenticate,
  uploadMiddleware.array('documents', 5),
  uploadAdditionalDocuments
);

// Update status (Admin or Officer)
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(Role.ADMIN, Role.OFFICER),
  updateClaimStatus
);

// Assign officer to claim (Admin only)
router.patch(
  '/:id/assign',
  authenticate,
  authorizeRoles(Role.ADMIN),
  assignOfficer
);

export default router;


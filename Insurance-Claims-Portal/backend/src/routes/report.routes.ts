import { Router } from 'express';
import { Role } from '@prisma/client';
import { getClaimsReport, exportClaimsCSV } from '../controllers/report.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/claims', authenticate, authorizeRoles(Role.ADMIN, Role.OFFICER), getClaimsReport);
router.get('/claims/export-csv', authenticate, authorizeRoles(Role.ADMIN), exportClaimsCSV);

export default router;


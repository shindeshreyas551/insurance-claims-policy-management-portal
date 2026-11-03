import { Router } from 'express';
import { getDocumentById, downloadDocument } from '../controllers/document.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:id/view', authenticate, getDocumentById);
router.get('/:id/download', authenticate, downloadDocument);

export default router;


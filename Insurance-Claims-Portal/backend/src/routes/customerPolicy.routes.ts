import { Router } from 'express';
import { getMyPolicies, getCustomerPolicyById } from '../controllers/customerPolicy.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my-policies', authenticate, getMyPolicies);
router.get('/:id', authenticate, getCustomerPolicyById);

export default router;


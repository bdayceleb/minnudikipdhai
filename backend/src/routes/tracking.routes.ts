import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { recordHeartbeat } from '../controllers/tracking.controller';

const router = Router();

router.post('/heartbeat', authenticate, recordHeartbeat);

export default router;

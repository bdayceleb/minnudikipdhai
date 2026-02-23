import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { recordHeartbeat, chapterHeartbeat } from '../controllers/tracking.controller';

const router = Router();

router.post('/heartbeat', authenticate, recordHeartbeat);
router.post('/chapter-heartbeat', authenticate, chapterHeartbeat);

export default router;

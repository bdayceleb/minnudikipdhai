import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { getAdminDashboardStats, getUserDashboardStats } from '../controllers/analytics.controller';

const router = Router();

router.get('/admin', authenticate, requireRole('ADMIN'), getAdminDashboardStats);
router.get('/user', authenticate, getUserDashboardStats);

export default router;

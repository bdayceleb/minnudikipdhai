import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
    getAllLectures,
    getLectureById,
    createLecture,
    updateLecture,
    deleteLecture
} from '../controllers/lecture.controller';

const router = Router();

router.get('/', authenticate, getAllLectures);
router.get('/:id', authenticate, getLectureById);

// Admin only routes
router.post('/', authenticate, requireRole('ADMIN'), createLecture);
router.put('/:id', authenticate, requireRole('ADMIN'), updateLecture);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteLecture);

export default router;

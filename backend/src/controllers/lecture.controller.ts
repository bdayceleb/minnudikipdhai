import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllLectures = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const role = req.user?.role;

        // Admin sees all, User sees only published
        const filter = role === 'ADMIN' ? {} : { is_published: true };

        const lectures = await prisma.lecture.findMany({
            where: filter,
            orderBy: { created_at: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                is_published: true,
                created_at: true,
                updated_at: true,
            }
        });

        res.json(lectures);
    } catch (error) {
        console.error('Get lectures error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLectureById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const role = req.user?.role;

        const lecture = await prisma.lecture.findUnique({
            where: { id }
        });

        if (!lecture) {
            res.status(404).json({ error: 'Lecture not found' });
            return;
        }

        // User cannot view unpublished lectures
        if (role === 'USER' && !lecture.is_published) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        res.json(lecture);
    } catch (error) {
        console.error('Get lecture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createLecture = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { title, description, content, is_published } = req.body;

        if (!userId || !title || !content) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const lecture = await prisma.lecture.create({
            data: {
                title,
                description,
                content,
                is_published: is_published || false,
                created_by: userId
            }
        });

        res.status(201).json(lecture);
    } catch (error) {
        console.error('Create lecture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateLecture = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { title, description, content, is_published } = req.body;

        const lecture = await prisma.lecture.update({
            where: { id },
            data: {
                title,
                description,
                content,
                is_published
            }
        });

        res.json(lecture);
    } catch (error) {
        console.error('Update lecture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteLecture = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;

        await prisma.lecture.delete({
            where: { id }
        });

        res.json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error('Delete lecture error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

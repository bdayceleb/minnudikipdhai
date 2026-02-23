import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
        req.user = decoded;

        // Verify user still exists
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ error: 'User no longer exists' });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const requireRole = (role: 'ADMIN' | 'USER') => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (req.user.role !== role) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
};

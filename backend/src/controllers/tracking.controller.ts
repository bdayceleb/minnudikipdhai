import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const recordHeartbeat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { pageName, timeSpentSeconds } = req.body;

        if (!userId || !pageName || typeof timeSpentSeconds !== 'number') {
            res.status(400).json({ error: 'Invalid heartbeat payload' });
            return;
        }

        // Add activity record (heartbeat usually sends the incremental diff or absolute,
        // assuming here it sends increments of 10 seconds or updates an existing record).
        // For simplicity, we just create a new record for each heartbeat or update today's.

        await prisma.pageActivity.create({
            data: {
                user_id: userId,
                page_name: pageName,
                time_spent_seconds: timeSpentSeconds
            }
        });

        // Also update daily aggregate
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.dailyStudyStats.upsert({
            where: {
                user_id_date: {
                    user_id: userId,
                    date: today
                }
            },
            update: {
                total_time_seconds: {
                    increment: timeSpentSeconds
                }
            },
            create: {
                user_id: userId,
                date: today,
                total_time_seconds: timeSpentSeconds
            }
        });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Tracking heartbeat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

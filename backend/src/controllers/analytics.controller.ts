import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAdminDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // 1. Total study hours
        const totalStats = await prisma.dailyStudyStats.aggregate({
            _sum: { total_time_seconds: true }
        });

        // 2. Today's hours
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStats = await prisma.dailyStudyStats.findFirst({
            where: { date: today }
        });

        // 3. Last 7 days chart data
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyChart = await prisma.dailyStudyStats.findMany({
            where: { date: { gte: last7Days } },
            orderBy: { date: 'asc' }
        });

        // 4. Session History (Recent 10)
        const recentSessions = await prisma.session.findMany({
            take: 10,
            orderBy: { login_time: 'desc' },
            include: { user: { select: { name: true, username: true } } }
        });

        // 5. Page Activity Summary
        const pageActivity = await prisma.pageActivity.groupBy({
            by: ['page_name'],
            _sum: { time_spent_seconds: true },
            orderBy: { _sum: { time_spent_seconds: 'desc' } }
        });

        // 6. Chapter Activity Summary
        const chapterActivity = await prisma.chapterActivity.groupBy({
            by: ['chapter_id', 'chapter_title', 'course_id'],
            _sum: { time_spent_seconds: true },
            orderBy: { _sum: { time_spent_seconds: 'desc' } }
        });

        res.json({
            totalTimeSeconds: totalStats._sum.total_time_seconds || 0,
            todayTimeSeconds: todayStats?.total_time_seconds || 0,
            weeklyChart,
            recentSessions,
            pageActivity,
            chapterActivity
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // 1. User's total time
        const totalStats = await prisma.dailyStudyStats.aggregate({
            where: { user_id: userId },
            _sum: { total_time_seconds: true }
        });

        // 2. User's today time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStats = await prisma.dailyStudyStats.findFirst({
            where: { user_id: userId, date: today }
        });

        // 3. User's weekly
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyChart = await prisma.dailyStudyStats.findMany({
            where: { user_id: userId, date: { gte: last7Days } },
            orderBy: { date: 'asc' }
        });

        res.json({
            totalTimeSeconds: totalStats._sum.total_time_seconds || 0,
            todayTimeSeconds: todayStats?.total_time_seconds || 0,
            weeklyChart
        });

    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

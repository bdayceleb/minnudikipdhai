import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        if (authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Find Minni's USER account specifically (not admin)
        const minni = await prisma.user.findFirst({
            where: { role: 'USER' }
        });

        if (!minni) {
            return NextResponse.json({
                totalTimeSeconds: 0, todayTimeSeconds: 0,
                weeklyChart: [], recentSessions: [], pageActivity: [], chapterActivity: [], trackingFeed: []
            });
        }

        // 1. Total study hours — MINNI ONLY
        const totalStats = await prisma.dailyStudyStats.aggregate({
            where: { user_id: minni.id },
            _sum: { total_time_seconds: true }
        });

        // 2. Today's hours — MINNI ONLY
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStats = await prisma.dailyStudyStats.findFirst({
            where: { user_id: minni.id, date: today }
        });

        // 3. Last 7 days chart data — MINNI ONLY, one bar per day
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyChartRaw = await prisma.dailyStudyStats.findMany({
            where: { user_id: minni.id, date: { gte: last7Days } },
            orderBy: { date: 'asc' }
        });

        // Deduplicate by date: if multiple rows for same calendar day, sum them
        const dateMap = new Map<string, number>();
        for (const row of weeklyChartRaw) {
            const dayKey = new Date(row.date).toISOString().split('T')[0];
            dateMap.set(dayKey, (dateMap.get(dayKey) || 0) + row.total_time_seconds);
        }
        const weeklyChart = Array.from(dateMap.entries()).map(([date, total_time_seconds]) => ({
            date, total_time_seconds
        }));

        // 4. Session History — MINNI ONLY
        const recentSessions = await prisma.session.findMany({
            where: { user_id: minni.id },
            take: 10,
            orderBy: { login_time: 'desc' },
            include: { user: { select: { name: true, username: true } } }
        });

        // 5. Page Activity Summary — MINNI ONLY
        const pageActivity = await prisma.pageActivity.groupBy({
            by: ['page_name'],
            where: { user_id: minni.id },
            _sum: { time_spent_seconds: true },
            orderBy: { _sum: { time_spent_seconds: 'desc' } }
        });

        // 6. Chapter Activity Summary — MINNI ONLY
        const chapterActivity = await prisma.chapterActivity.groupBy({
            by: ['chapter_id', 'chapter_title', 'course_id'],
            where: { user_id: minni.id },
            _sum: { time_spent_seconds: true },
            orderBy: { _sum: { time_spent_seconds: 'desc' } }
        });

        // 7. Tracking Intelligence Feed (Recent 20)
        const trackingFeed = await prisma.trackingEvent.findMany({
            take: 20,
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({
            totalTimeSeconds: totalStats._sum.total_time_seconds || 0,
            todayTimeSeconds: todayStats?.total_time_seconds || 0,
            weeklyChart,
            recentSessions,
            pageActivity,
            chapterActivity,
            trackingFeed
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

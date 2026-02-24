import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);

        // 1. User's total time
        const totalStats = await prisma.dailyStudyStats.aggregate({
            where: { user_id: authUser.userId },
            _sum: { total_time_seconds: true }
        });

        // 2. User's today time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStats = await prisma.dailyStudyStats.findFirst({
            where: { user_id: authUser.userId, date: today }
        });

        // 3. User's weekly
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const weeklyChart = await prisma.dailyStudyStats.findMany({
            where: { user_id: authUser.userId, date: { gte: last7Days } },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json({
            totalTimeSeconds: totalStats._sum.total_time_seconds || 0,
            todayTimeSeconds: todayStats?.total_time_seconds || 0,
            weeklyChart
        });
    } catch (error) {
        console.error('User stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

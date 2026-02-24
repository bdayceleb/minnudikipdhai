import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Fetch the USER role (Minni) to get her stats for the landing page
        const user = await prisma.user.findFirst({
            where: { role: 'USER' }
        });

        if (!user) {
            return NextResponse.json({ todayTimeSeconds: 0, totalTimeSeconds: 0 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayStats = await prisma.dailyStudyStats.findFirst({
            where: { user_id: user.id, date: today }
        });

        const totalStats = await prisma.dailyStudyStats.aggregate({
            where: { user_id: user.id },
            _sum: { total_time_seconds: true }
        });

        return NextResponse.json({
            todayTimeSeconds: todayStats?.total_time_seconds || 0,
            totalTimeSeconds: totalStats._sum.total_time_seconds || 0,
        });
    } catch (error) {
        console.error('Public stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

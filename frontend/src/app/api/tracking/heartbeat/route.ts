import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        const { pageName, timeSpentSeconds } = await req.json();

        if (!pageName || typeof timeSpentSeconds !== 'number') {
            return NextResponse.json({ error: 'Invalid heartbeat payload' }, { status: 400 });
        }

        await prisma.pageActivity.create({
            data: {
                user_id: authUser.userId,
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
                    user_id: authUser.userId,
                    date: today
                }
            },
            update: {
                total_time_seconds: { increment: timeSpentSeconds }
            },
            create: {
                user_id: authUser.userId,
                date: today,
                total_time_seconds: timeSpentSeconds
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking heartbeat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

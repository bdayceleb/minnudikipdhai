import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        const { courseId, chapterId, chapterTitle, timeSpentSeconds } = await req.json();

        if (!courseId || !chapterId || typeof timeSpentSeconds !== 'number') {
            return NextResponse.json({ error: 'Invalid chapter heartbeat payload' }, { status: 400 });
        }

        await prisma.chapterActivity.upsert({
            where: {
                user_id_course_id_chapter_id: {
                    user_id: authUser.userId,
                    course_id: courseId,
                    chapter_id: chapterId
                }
            },
            update: {
                time_spent_seconds: { increment: timeSpentSeconds },
                last_visited_at: new Date()
            },
            create: {
                user_id: authUser.userId,
                course_id: courseId,
                chapter_id: chapterId,
                chapter_title: chapterTitle || chapterId,
                time_spent_seconds: timeSpentSeconds
            }
        });

        // Also increment daily aggregate
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
        console.error('Chapter tracking heartbeat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

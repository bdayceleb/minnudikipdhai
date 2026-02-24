import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json();

        if (sessionId) {
            const session = await prisma.session.findUnique({ where: { id: sessionId } });
            if (session) {
                const logoutTime = new Date();
                const durationSeconds = Math.floor((logoutTime.getTime() - session.login_time.getTime()) / 1000);

                await prisma.session.update({
                    where: { id: sessionId },
                    data: {
                        logout_time: logoutTime,
                        session_duration_seconds: durationSeconds
                    }
                });
            }
        }

        const response = NextResponse.json({ message: 'Logged out successfully' });
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

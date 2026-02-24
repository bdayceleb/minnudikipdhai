import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generateTokens } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || password !== user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session record
        const session = await prisma.session.create({
            data: {
                user_id: user.id,
                ip_address: req.headers.get('x-forwarded-for') || 'unknown',
                user_agent: req.headers.get('user-agent') || undefined,
            }
        });

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, username: user.username, role: user.role },
            sessionId: session.id
        });

        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 mins in seconds
            path: '/',
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

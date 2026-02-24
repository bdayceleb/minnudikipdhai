import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokens } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const refreshTokenValue = req.cookies.get('refreshToken')?.value;

        if (!refreshTokenValue) {
            return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
        }

        const decoded = verifyRefreshToken(refreshTokenValue);
        const { accessToken, refreshToken } = generateTokens(decoded.userId, decoded.role);

        const isProduction = process.env.NODE_ENV === 'production';
        const response = NextResponse.json({ message: 'Tokens refreshed' });

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 15 * 60,
            path: '/',
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
}

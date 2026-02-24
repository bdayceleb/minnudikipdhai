import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export interface AuthUser {
    userId: string;
    role: string;
}

export function generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser> {
    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
        throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
        throw new Error('User no longer exists');
    }

    return decoded;
}

export function verifyRefreshToken(token: string): AuthUser {
    return jwt.verify(token, JWT_REFRESH_SECRET) as AuthUser;
}

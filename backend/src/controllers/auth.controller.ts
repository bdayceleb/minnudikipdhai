import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { config } from '../config';

const generateTokens = (userId: string, role: string) => {
    const accessToken = jwt.sign({ userId, role }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry as any });
    const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry as any });
    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Create session record
        const session = await prisma.session.create({
            data: {
                user_id: user.id,
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
            }
        });

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        // Set HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 mins
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            sessionId: session.id
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.body; // Client sends active sessionId

        if (sessionId) {
            // Find session and calculate duration
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

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }

        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string; role: string };
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId, decoded.role);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: 'Tokens refreshed' });

    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user is populated by authenticate middleware
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

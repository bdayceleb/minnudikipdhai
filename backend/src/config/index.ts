import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
        accessExpiry: '15m',
        refreshExpiry: '7d',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
};

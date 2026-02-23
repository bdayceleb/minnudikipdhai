import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load Env
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Basic Route for test
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Push The Bar Higher API is running' });
});

// Import Routes (to be created)
import authRoutes from './routes/auth.routes';
import lectureRoutes from './routes/lecture.routes';
import trackingRoutes from './routes/tracking.routes';
import analyticsRoutes from './routes/analytics.routes';

app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

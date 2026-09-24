import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;

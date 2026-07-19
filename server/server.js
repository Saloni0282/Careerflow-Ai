import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import seedJobs from './data/seedJobs.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (error) => {
  console.error('[Unhandled Promise Rejection]', error);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]', error);
  process.exit(1);
});

connectDB()
  .then(async () => {
    console.log('[MongoDB] Database connection established');
    try {
      await seedJobs();
      console.log('[Seed Jobs] Seed check completed');
    } catch (err) {
      console.error('[Seed Jobs Error] Seed process failed, continuing startup', err);
    }
  })
  .catch((error) => {
    console.error('[MongoDB Startup Error]', error);
    process.exit(1);
  });

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/home', (req, res) => {
  res.status(200).json({ message: 'Welcome Route' });
});
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
  console.warn('[Route Not Found]', {
    method: req.method,
    path: req.originalUrl
  });

  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

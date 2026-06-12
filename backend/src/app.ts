import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import labRoutes from './routes/labs';
import progressRoutes from './routes/progress';
import competencyRoutes from './routes/competency';
import aiRoutes from './routes/ai';
import simulationRoutes from './routes/simulation';
import adminRoutes from './routes/admin';

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/labs', labRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/competency', competencyRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/simulation', simulationRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
};

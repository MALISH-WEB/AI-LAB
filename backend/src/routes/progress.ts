import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../config/data-source';
import { Lab } from '../entities/Lab';
import { LabSession } from '../entities/LabSession';
import { requireAuth } from '../middleware/auth';
import { User } from '../entities/User';

const router = Router();

router.post('/start/:labId', requireAuth, async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const labRepo = AppDataSource.getRepository(Lab);
  const sessionRepo = AppDataSource.getRepository(LabSession);

  const user = await userRepo.findOne({ where: { id: req.user!.userId } });
  const lab = await labRepo.findOne({ where: { id: req.params.labId } });

  if (!user || !lab) {
    res.status(404).json({ message: 'User or lab not found' });
    return;
  }

  const session = sessionRepo.create({ user, lab, progressPercent: 0, completed: false, snapshot: { actions: [] } });
  await sessionRepo.save(session);
  res.status(201).json(session);
});

router.patch('/:sessionId', requireAuth, async (req, res) => {
  const schema = z.object({ progressPercent: z.number().min(0).max(100), completed: z.boolean().optional(), snapshot: z.record(z.unknown()).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }
  const repo = AppDataSource.getRepository(LabSession);
  const session = await repo.findOne({ where: { id: req.params.sessionId } });
  if (!session || session.user.id !== req.user!.userId) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  session.progressPercent = parsed.data.progressPercent;
  session.completed = parsed.data.completed ?? session.progressPercent === 100;
  session.snapshot = parsed.data.snapshot ?? session.snapshot;
  await repo.save(session);
  res.json(session);
});

router.get('/me', requireAuth, async (req, res) => {
  const repo = AppDataSource.getRepository(LabSession);
  const sessions = await repo.find({ where: { user: { id: req.user!.userId } as User }, order: { updatedAt: 'DESC' } });
  res.json(sessions);
});

export default router;

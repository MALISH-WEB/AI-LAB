import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../config/data-source';
import { Lab } from '../entities/Lab';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const labSchema = z.object({
  title: z.string().min(3),
  domain: z.enum(['networking', 'cybersecurity', 'robotics', 'data_analytics', 'software_engineering', 'general_computing']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  description: z.string().min(10),
  metadata: z.record(z.unknown()).optional()
});

router.get('/', requireAuth, async (_req, res) => {
  const repo = AppDataSource.getRepository(Lab);
  const labs = await repo.find();
  res.json(labs);
});

router.get('/:id', requireAuth, async (req, res) => {
  const repo = AppDataSource.getRepository(Lab);
  const lab = await repo.findOne({ where: { id: req.params.id } });
  if (!lab) {
    res.status(404).json({ message: 'Lab not found' });
    return;
  }
  res.json(lab);
});

router.post('/', requireAuth, requireRole('admin', 'instructor'), async (req, res) => {
  const parsed = labSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? 'Invalid payload' });
    return;
  }
  const repo = AppDataSource.getRepository(Lab);
  const created = repo.create(parsed.data);
  await repo.save(created);
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireRole('admin', 'instructor'), async (req, res) => {
  const parsed = labSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }
  const repo = AppDataSource.getRepository(Lab);
  const lab = await repo.findOne({ where: { id: req.params.id } });
  if (!lab) {
    res.status(404).json({ message: 'Lab not found' });
    return;
  }
  Object.assign(lab, parsed.data);
  await repo.save(lab);
  res.json(lab);
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const repo = AppDataSource.getRepository(Lab);
  const lab = await repo.findOne({ where: { id: req.params.id } });
  if (!lab) {
    res.status(404).json({ message: 'Lab not found' });
    return;
  }
  await repo.delete({ id: lab.id });
  res.status(204).send();
});

export default router;

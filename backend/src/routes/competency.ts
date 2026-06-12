import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../config/data-source';
import { CompetencySkill } from '../entities/CompetencySkill';
import { requireAuth } from '../middleware/auth';
import { updateCompetencyFromMetrics } from '../services/competency-service';
import { User } from '../entities/User';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const repo = AppDataSource.getRepository(CompetencySkill);
  const skills = await repo.find({ where: { user: { id: req.user!.userId } as User } });
  res.json(skills);
});

router.post('/evaluate', requireAuth, async (req, res) => {
  const schema = z.object({
    domain: z.enum(['networking', 'cybersecurity', 'robotics', 'data_analytics', 'software_engineering', 'general_computing']),
    accuracy: z.number().min(0).max(100),
    completionSpeed: z.number().min(0).max(100),
    conceptUnderstanding: z.number().min(0).max(100)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const skillRepo = AppDataSource.getRepository(CompetencySkill);
  const user = await userRepo.findOne({ where: { id: req.user!.userId } });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const updated = updateCompetencyFromMetrics(parsed.data);
  let skill = await skillRepo.findOne({ where: { user: { id: user.id } as User, domain: parsed.data.domain } });

  if (!skill) {
    skill = skillRepo.create({ user, domain: parsed.data.domain, mastery: updated.mastery, level: updated.level, prerequisites: [] });
  } else {
    skill.mastery = updated.mastery;
    skill.level = updated.level;
  }

  await skillRepo.save(skill);
  res.json(skill);
});

export default router;

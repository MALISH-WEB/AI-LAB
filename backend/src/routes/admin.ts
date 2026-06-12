import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Lab } from '../entities/Lab';
import { AdminAssignment } from '../entities/AdminAssignment';

const router = Router();

router.get('/users', requireAuth, requireRole('admin', 'instructor'), async (_req, res) => {
  const users = await AppDataSource.getRepository(User).find({ select: ['id', 'email', 'name', 'role', 'createdAt'] });
  res.json(users);
});

router.post('/assignments', requireAuth, requireRole('admin', 'instructor'), async (req, res) => {
  const schema = z.object({ instructorId: z.string().uuid(), studentId: z.string().uuid(), labId: z.string().uuid(), notes: z.string().min(3) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid assignment payload' });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const labRepo = AppDataSource.getRepository(Lab);
  const assignmentRepo = AppDataSource.getRepository(AdminAssignment);

  const [instructor, student, lab] = await Promise.all([
    userRepo.findOne({ where: { id: parsed.data.instructorId } }),
    userRepo.findOne({ where: { id: parsed.data.studentId } }),
    labRepo.findOne({ where: { id: parsed.data.labId } })
  ]);

  if (!instructor || !student || !lab) {
    res.status(404).json({ message: 'Instructor, student, or lab not found' });
    return;
  }

  const assignment = assignmentRepo.create(parsed.data);
  await assignmentRepo.save(assignment);
  res.status(201).json(assignment);
});

router.get('/assignments', requireAuth, requireRole('admin', 'instructor'), async (_req, res) => {
  const assignments = await AppDataSource.getRepository(AdminAssignment).find({ order: { createdAt: 'DESC' } });
  res.json(assignments);
});

export default router;

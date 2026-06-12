import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { signAccessToken, signRefreshToken } from '../services/token-service';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { requireAuth } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['student', 'instructor', 'admin']).default('student')
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? 'Invalid payload' });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const tokenRepo = AppDataSource.getRepository(RefreshToken);

  const existing = await userRepo.findOne({ where: { email: parsed.data.email } });
  if (existing) {
    res.status(409).json({ message: 'Email already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = userRepo.create({ ...parsed.data, passwordHash });
  await userRepo.save(user);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refresh = tokenRepo.create({
    token: refreshToken,
    user,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  await tokenRepo.save(refresh);

  res.status(201).json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid credentials payload' });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const tokenRepo = AppDataSource.getRepository(RefreshToken);

  const user = await userRepo.findOne({ where: { email: parsed.data.email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await tokenRepo.delete({ user: { id: user.id } as User });
  await tokenRepo.save(tokenRepo.create({ token: refreshToken, user, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }));

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post('/refresh', async (req, res) => {
  const schema = z.object({ refreshToken: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Missing refresh token' });
    return;
  }

  const tokenRepo = AppDataSource.getRepository(RefreshToken);
  const found = await tokenRepo.findOne({ where: { token: parsed.data.refreshToken } });
  if (!found || found.expiresAt.getTime() < Date.now()) {
    res.status(401).json({ message: 'Refresh token expired or invalid' });
    return;
  }

  try {
    const payload = jwt.verify(parsed.data.refreshToken, env.jwtRefreshSecret) as { userId: string };
    if (payload.userId !== found.user.id) {
      res.status(401).json({ message: 'Refresh token mismatch' });
      return;
    }
  } catch {
    res.status(401).json({ message: 'Invalid refresh token signature' });
    return;
  }

  const newRefreshToken = signRefreshToken(found.user);
  const newAccessToken = signAccessToken(found.user);
  await tokenRepo.delete({ id: found.id });
  await tokenRepo.save(tokenRepo.create({ token: newRefreshToken, user: found.user, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }));

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

router.get('/me', requireAuth, async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: req.user!.userId } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
});

export default router;

import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../entities/User';

export const signAccessToken = (user: User): string =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwtAccessSecret, { expiresIn: '15m' });

export const signRefreshToken = (user: User): string =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwtRefreshSecret, { expiresIn: '7d' });

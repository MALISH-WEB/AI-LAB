import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@ai-lab/shared';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (authHeader?.startsWith('Token ')) {
    token = authHeader.slice(6);
  }

  if (!token) {
    res.status(401).json({ message: 'Missing access token' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as { userId: string; role: UserRole };
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid access token' });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};

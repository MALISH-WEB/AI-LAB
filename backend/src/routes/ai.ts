import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { generateTutorResponse } from '../services/ai-service';
import { AppDataSource } from '../config/data-source';
import { AIInteraction } from '../entities/AIInteraction';
import { User } from '../entities/User';

const router = Router();

router.post('/assist', requireAuth, async (req, res) => {
  const schema = z.object({ prompt: z.string().min(3), context: z.string().optional() });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const interactionRepo = AppDataSource.getRepository(AIInteraction);
  const user = await userRepo.findOne({ where: { id: req.user!.userId } });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const result = await generateTutorResponse(parsed.data.prompt, parsed.data.context);
  await interactionRepo.save(
    interactionRepo.create({
      user,
      prompt: parsed.data.prompt,
      response: result.text,
      usedFallback: result.usedFallback
    })
  );

  res.json(result);
});

router.post('/assist/stream', requireAuth, async (req, res) => {
  const schema = z.object({ prompt: z.string().min(3), context: z.string().optional() });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }

  const result = await generateTutorResponse(parsed.data.prompt, parsed.data.context);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  result.text.split(' ').forEach((token, index) => {
    setTimeout(() => {
      res.write(`data: ${token}\n\n`);
      if (index === result.text.split(' ').length - 1) {
        res.write('event: done\\ndata: complete\\n\\n');
        res.end();
      }
    }, index * 25);
  });
});

export default router;

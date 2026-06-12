import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { NETWORKING_SCENARIOS, NetworkingSimulationEngine } from '../simulation/networking';
import { AppDataSource } from '../config/data-source';
import { LabSession } from '../entities/LabSession';
import { SimulationEvent } from '../entities/SimulationEvent';
import { getSocketServer } from '../services/socket-service';

const router = Router();
const engine = new NetworkingSimulationEngine();

router.get('/networking/scenarios', requireAuth, (_req, res) => {
  res.json(NETWORKING_SCENARIOS);
});

router.post('/networking/execute', requireAuth, async (req, res) => {
  const schema = z.object({ sessionId: z.string().uuid(), scenarioId: z.string(), action: z.string().min(2) });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }

  const sessionRepo = AppDataSource.getRepository(LabSession);
  const eventRepo = AppDataSource.getRepository(SimulationEvent);
  const session = await sessionRepo.findOne({ where: { id: parsed.data.sessionId } });

  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  const result = engine.validateAction(parsed.data.scenarioId, parsed.data.action);
  const progressAdjustment = result.valid ? 20 : 0;
  session.progressPercent = Math.min(100, Math.max(0, session.progressPercent + progressAdjustment));
  session.completed = session.progressPercent === 100;

  const snapshot = (session.snapshot ?? { actions: [] }) as { actions: string[] };
  snapshot.actions = [...(snapshot.actions ?? []), parsed.data.action];
  session.snapshot = snapshot;

  await sessionRepo.save(session);

  const loggedEvent = eventRepo.create({
    session,
    eventType: result.valid ? 'action.accepted' : 'action.rejected',
    payload: {
      scenarioId: parsed.data.scenarioId,
      action: parsed.data.action,
      feedback: result.feedback,
      progressPercent: session.progressPercent
    }
  });
  await eventRepo.save(loggedEvent);

  getSocketServer()?.to(session.user.id).emit('simulation:update', {
    sessionId: session.id,
    result,
    progressPercent: session.progressPercent
  });

  res.json({ result, progressPercent: session.progressPercent, completed: session.completed });
});

export default router;

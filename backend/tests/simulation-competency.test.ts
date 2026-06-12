process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite';

import request from 'supertest';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/config/data-source';

describe('Networking simulation and competency', () => {
  const app = createApp();
  let accessToken = '';
  let labId = '';
  let sessionId = '';

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const auth = await request(app).post('/api/auth/register').send({
      email: 'admin@example.com',
      name: 'Admin',
      password: 'Password123!',
      role: 'admin'
    });

    accessToken = auth.body.accessToken;

    const lab = await request(app)
      .post('/api/labs')
      .set('Authorization', 'Token ' + accessToken)
      .send({
        title: 'Networking Fundamentals',
        domain: 'networking',
        difficulty: 'beginner',
        description: 'Core networking lab with scenarios'
      });

    labId = lab.body.id;

    const session = await request(app)
      .post(`/api/progress/start/${labId}`)
      .set('Authorization', 'Token ' + accessToken);

    sessionId = session.body.id;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('returns networking scenarios and validates actions', async () => {
    const scenarios = await request(app)
      .get('/api/simulation/networking/scenarios')
      .set('Authorization', 'Token ' + accessToken);

    expect(scenarios.status).toBe(200);
    expect(scenarios.body).toHaveLength(3);

    const execute = await request(app)
      .post('/api/simulation/networking/execute')
      .set('Authorization', 'Token ' + accessToken)
      .send({ sessionId, scenarioId: 'network-basic-config', action: 'set-ip' });

    expect(execute.status).toBe(200);
    expect(execute.body.result.valid).toBe(true);
    expect(execute.body.progressPercent).toBeGreaterThan(0);
  });

  it('calculates competency level from metrics', async () => {
    const evaluation = await request(app)
      .post('/api/competency/evaluate')
      .set('Authorization', 'Token ' + accessToken)
      .send({
        domain: 'networking',
        accuracy: 80,
        completionSpeed: 70,
        conceptUnderstanding: 90
      });

    expect(evaluation.status).toBe(200);
    expect(evaluation.body.mastery).toBe(80);
    expect(evaluation.body.level).toBe('Expert');
  });
});

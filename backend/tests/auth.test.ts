process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite';

import request from 'supertest';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/config/data-source';

describe('Authentication flow', () => {
  const app = createApp();

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('registers, logs in, and reads profile', async () => {
    const register = await request(app).post('/api/auth/register').send({
      email: 'student@example.com',
      name: 'Student',
      password: 'Password123!',
      role: 'student'
    });

    expect(register.status).toBe(201);
    expect(register.body.accessToken).toBeDefined();

    const login = await request(app).post('/api/auth/login').send({
      email: 'student@example.com',
      password: 'Password123!'
    });

    expect(login.status).toBe(200);
    expect(login.body.refreshToken).toBeDefined();

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Token ' + login.body.accessToken);

    expect(me.status).toBe(200);
    expect(me.body.email).toBe('student@example.com');
  });
});

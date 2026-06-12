import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbName: process.env.DB_NAME ?? 'ai_lab',
  dbUser: process.env.DB_USER ?? 'ai_lab',
  dbPassword: process.env.DB_PASSWORD ?? 'ai_lab',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
};

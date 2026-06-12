import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Lab } from '../entities/Lab';
import { LabSession } from '../entities/LabSession';
import { CompetencySkill } from '../entities/CompetencySkill';
import { SimulationEvent } from '../entities/SimulationEvent';
import { AIInteraction } from '../entities/AIInteraction';
import { AdminAssignment } from '../entities/AdminAssignment';
import { RefreshToken } from '../entities/RefreshToken';

const isSqlite = process.env.DB_TYPE === 'sqlite';

export const AppDataSource = new DataSource(
  isSqlite
    ? {
        type: 'sqlite',
        database: process.env.SQLITE_PATH ?? ':memory:',
        synchronize: true,
        entities: [User, Lab, LabSession, CompetencySkill, SimulationEvent, AIInteraction, AdminAssignment, RefreshToken]
      }
    : {
        type: 'postgres',
        host: env.dbHost,
        port: env.dbPort,
        database: env.dbName,
        username: env.dbUser,
        password: env.dbPassword,
        synchronize: true,
        entities: [User, Lab, LabSession, CompetencySkill, SimulationEvent, AIInteraction, AdminAssignment, RefreshToken]
      }
);

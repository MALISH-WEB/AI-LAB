import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { LabSession } from './LabSession';

@Entity('simulation_events')
export class SimulationEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => LabSession, (session) => session.events, { eager: true })
  session!: LabSession;

  @Column({ type: 'varchar' })
  eventType!: string;

  @Column({ type: 'simple-json' })
  payload!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}

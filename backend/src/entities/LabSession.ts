import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Lab } from './Lab';
import { SimulationEvent } from './SimulationEvent';

@Entity('lab_sessions')
export class LabSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  user!: User;

  @ManyToOne(() => Lab, (lab) => lab.sessions, { eager: true })
  lab!: Lab;

  @Column({ default: 0 })
  progressPercent!: number;

  @Column({ default: false })
  completed!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  snapshot?: Record<string, unknown>;

  @OneToMany(() => SimulationEvent, (event) => event.session)
  events!: SimulationEvent[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

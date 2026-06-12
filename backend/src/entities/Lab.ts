import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LabDomain } from '@ai-lab/shared';
import { LabSession } from './LabSession';

@Entity('labs')
export class Lab {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'varchar' })
  domain!: LabDomain;

  @Column({ type: 'varchar', default: 'beginner' })
  difficulty!: 'beginner' | 'intermediate' | 'advanced';

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown>;

  @OneToMany(() => LabSession, (session) => session.lab)
  sessions!: LabSession[];
}

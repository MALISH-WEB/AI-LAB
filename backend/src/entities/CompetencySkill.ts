import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { LabDomain } from '@ai-lab/shared';

@Entity('competency_skills')
export class CompetencySkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.skills, { eager: true })
  user!: User;

  @Column({ type: 'varchar' })
  domain!: LabDomain;

  @Column({ default: 0 })
  mastery!: number;

  @Column({ type: 'varchar', default: 'Beginner' })
  level!: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

  @Column({ type: 'simple-json', nullable: true })
  prerequisites?: string[];

  @UpdateDateColumn()
  updatedAt!: Date;
}

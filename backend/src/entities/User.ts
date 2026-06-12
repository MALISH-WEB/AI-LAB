import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LabSession } from './LabSession';
import { CompetencySkill } from './CompetencySkill';
import { RefreshToken } from './RefreshToken';
import { AIInteraction } from './AIInteraction';
import { UserRole } from '@ai-lab/shared';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'varchar', default: 'student' })
  role!: UserRole;

  @OneToMany(() => LabSession, (session) => session.user)
  sessions!: LabSession[];

  @OneToMany(() => CompetencySkill, (skill) => skill.user)
  skills!: CompetencySkill[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => AIInteraction, (interaction) => interaction.user)
  aiInteractions!: AIInteraction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

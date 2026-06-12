import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('ai_interactions')
export class AIInteraction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.aiInteractions, { eager: true })
  user!: User;

  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'text' })
  response!: string;

  @Column({ default: false })
  usedFallback!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

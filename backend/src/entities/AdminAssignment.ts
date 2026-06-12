import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin_assignments')
export class AdminAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instructorId!: string;

  @Column()
  studentId!: string;

  @Column()
  labId!: string;

  @Column({ type: 'text' })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Fulfills UUID requirement 

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // For Audit Trails 

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date; // For Audit Trails 
}
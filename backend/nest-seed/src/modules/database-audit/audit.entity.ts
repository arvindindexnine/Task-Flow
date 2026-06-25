import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Audit {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: null })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: null })
  updatedAt: Date;
}

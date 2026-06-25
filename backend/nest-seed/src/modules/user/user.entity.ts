import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Audit } from '../database-audit/audit.entity';
import { Role } from '../role/role.entity';
import { Task } from '../task/task.entity';

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.APPROVED,
  })
  status: UserStatus;

  @Column({ default: null })
  name: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Promise<Role[]>;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Promise<Task[]>;

  @Column({ name: 'reset_token', nullable: true, default: null })
  resetToken: string;

  @Column({ name: 'reset_token_expiry', type: 'timestamptz', nullable: true, default: null })
  resetTokenExpiry: Date;
}

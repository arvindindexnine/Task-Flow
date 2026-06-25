import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../database-audit/audit.entity';
@Entity()
export class Role extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    unique: true,
  })
  @IsNotEmpty()
  name: string;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
  @Column({ name: 'balance', type: 'bigint' })
  balance: bigint;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ name: 'hashed_password', type: 'varchar', length: 50 })
  hashedPassword: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

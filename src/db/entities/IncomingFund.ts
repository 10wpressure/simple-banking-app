import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity('incoming_funds')
export class IncomingFund {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  @ManyToOne(() => Account, (account) => account.id)
  accountId: string;

  @Column({ name: 'amount', type: 'bigint' })
  amount: bigint;

  @Column({ name: 'settlement_datetime', type: 'timestamp' })
  settlementDateTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

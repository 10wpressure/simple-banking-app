import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IncomingFund } from './IncomingFund';

@Entity('settled_funds')
export class SettledFund {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @JoinColumn({ name: 'incoming_fund_id' })
  @OneToOne(() => IncomingFund, (incomingFund) => incomingFund.id)
  incomingFundId: string;

  @Column({
    name: 'amount',
    type: 'bigint',
  })
  amount: bigint;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor(incomingFundId: string, balance: bigint) {
    this.incomingFundId = incomingFundId;
    this.amount = balance;
  }
}

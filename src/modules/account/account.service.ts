import { Inject, Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Account, IncomingFund, SettledFund } from '../../db/entities';
import { AppDataSource } from '../../db/data-source';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import BigNumber from 'bignumber.js';

export interface IGetAccountBalanceRequest {
  accountId: number;
  dateTime?: number;
}

export class GetAccountBalanceRequest implements IGetAccountBalanceRequest {
  @IsDefined()
  @IsNotEmpty()
  accountId: number;

  @IsNumber()
  @IsOptional()
  dateTime?: number;
}

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(IncomingFund)
    private readonly incomingFundRepository: Repository<IncomingFund>,
    @InjectRepository(SettledFund)
    private readonly settledFundRepository: Repository<SettledFund>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getAccountBalance({
    accountId,
    dateTime,
  }: IGetAccountBalanceRequest): Promise<{ balance: string }> {
    try {
      const time = (
        dateTime ? new Date(Number(dateTime) * 1000) : new Date()
      ).toISOString();

      const cache = await this.cacheManager.get<string>(
        `account_balance:${accountId}_${dateTime}`,
      );
      if (cache) {
        return {
          balance: cache,
        };
      }

      const funds = await this.incomingFundRepository
        .createQueryBuilder('fund')
        .loadAllRelationIds()
        .where('account_id = :accountId', { accountId })
        .andWhere('settlement_datetime <= :time', { time })
        .cache(true)
        .getMany();

      const balance = funds.reduce(
        (acc, fund) => BigNumber(fund?.amount.toString()).plus(acc),
        BigNumber(0),
      );

      await this.cacheManager.set(
        `account_balance:${accountId}_${dateTime}`,
        balance.toFixed(),
        60000,
      );

      return {
        balance: BigNumber(balance).toFixed(),
      };
    } catch (e) {
      this.logger.error(e);
      return {
        balance: '0',
      };
    }
  }

  public async settleBalances(): Promise<void> {
    await AppDataSource.manager.transaction('SERIALIZABLE', async (manager) => {
      const incomingFundsRepo = manager.getRepository(IncomingFund);
      const settledFundsRepo = manager.getRepository(SettledFund);
      const accountRepo = manager.getRepository(Account);

      const newlySettledFunds = await this.getNewlySettledFunds(
        incomingFundsRepo,
      );
      const deltas = this.calculateBalanceDeltas(newlySettledFunds);

      const currentAccounts = await this.calculateAccountBalances(
        accountRepo,
        deltas,
      );

      const settledFunds = this.mapIncomingToSettledFunds(newlySettledFunds);

      await settledFundsRepo.save(settledFunds);

      await accountRepo.save(currentAccounts);
    });
  }

  private async calculateAccountBalances(
    repo: Repository<Account>,
    deltas: Map<string, bigint>,
  ): Promise<Account[]> {
    const accountIds = Array.from(deltas).map(([id]) => id);

    const accounts = await repo.findBy({ id: In(accountIds) });

    return accounts.map((a) => {
      a.balance =
        BigInt(deltas.get(a.id) ?? BigInt(0)) + BigInt(a?.balance ?? 0);
      return a;
    });
  }

  private calculateBalanceDeltas(
    newlySettledFunds: IncomingFund[],
  ): Map<string, bigint> {
    return newlySettledFunds.reduce((acc, fund) => {
      const currentDelta = acc.get(fund.accountId) ?? BigInt(0);
      const delta = BigInt(fund.amount) + BigInt(currentDelta);
      acc.set(fund.accountId, delta);
      return acc;
    }, new Map<string, bigint>());
  }

  private async getNewlySettledFunds(
    repo: Repository<IncomingFund>,
  ): Promise<IncomingFund[] | undefined> {
    const now = new Date();
    return await repo
      .createQueryBuilder('fund')
      .where('settlement_datetime <= :now', { now })
      .andWhere('id NOT IN (SELECT incoming_fund_id FROM settled_funds)')
      .loadAllRelationIds()
      .getMany();
  }

  private mapIncomingToSettledFunds(funds: IncomingFund[]): SettledFund[] {
    return funds.map((fund) => new SettledFund(fund.id, fund.amount));
  }
}

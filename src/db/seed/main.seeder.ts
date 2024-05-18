import { DataSource } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Account } from '../entities/Account';
import { IncomingFund } from '../entities/IncomingFund';
import { User } from '../entities/User';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const accountsRepository = dataSource.getRepository(Account);
    const incomingFundsRepository = dataSource.getRepository(IncomingFund);

    const userFactory = factoryManager.get(User);
    const accountFactory = factoryManager.get(Account);
    const incomingFundFactory = factoryManager.get(IncomingFund);

    const users = await userFactory.saveMany(10);

    const accounts = await this.createAccounts(accountFactory, users);
    await accountsRepository.save(accounts);

    const incomingFunds = await this.createIncomingFunds(
      incomingFundFactory,
      accounts,
    );
    await incomingFundsRepository.save(incomingFunds);
  }

  private async createAccounts(
    accountFactory: SeederFactory<Account, unknown>,
    users: User[],
    amount = 100,
  ): Promise<Account[]> {
    return Promise.all(
      Array(amount)
        .fill('')
        .map(async () => {
          return await accountFactory.make({
            user: faker.helpers.arrayElement(users),
          });
        }),
    );
  }

  private async createIncomingFunds(
    incomingFundFactory: SeederFactory<IncomingFund, unknown>,
    accounts: Account[],
    amount = 1000,
  ): Promise<IncomingFund[]> {
    return await Promise.all(
      Array(amount)
        .fill('')
        .map(async () => {
          return await incomingFundFactory.make({
            accountId: faker.helpers.arrayElement(accounts.map((a) => a.id)),
          });
        }),
    );
  }
}

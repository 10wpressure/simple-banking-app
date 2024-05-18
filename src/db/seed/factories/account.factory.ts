import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Account } from '../../entities';

export const AccountFactory = setSeederFactory(Account, (faker: Faker) => {
  const account = new Account();
  account.id = faker.string.uuid();
  account.balance = faker.number.bigInt({ min: 1n, max: 1000000n });
  return account;
});

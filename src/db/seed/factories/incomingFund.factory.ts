import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { IncomingFund } from '../../entities';

export const IncomingFundFactory = setSeederFactory(
  IncomingFund,
  (faker: Faker) => {
    const fund = new IncomingFund();
    fund.amount = faker.number.bigInt({ min: 1n, max: 1000000n });
    fund.settlementDateTime = faker.date.between({
      from: new Date(),
      to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });

    return fund;
  },
);

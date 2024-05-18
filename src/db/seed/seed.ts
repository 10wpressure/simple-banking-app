import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './main.seeder';
import { AccountFactory, IncomingFundFactory, UserFactory } from './factories';
import { dataSourceOptions } from '../../config';

const options: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  factories: [UserFactory, AccountFactory, IncomingFundFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async (d) => {
  await d.synchronize();
  await runSeeders(d);
  process.exit();
});

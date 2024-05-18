import 'reflect-metadata';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Account, IncomingFund, SettledFund, User } from './db/entities';

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'password',
  database: process.env.POSTGRES_DB ?? 'postgres',
  synchronize: true,
  logging: false,
  entities: [Account, IncomingFund, SettledFund, User],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  subscribers: [],
};

export const AppConfig = {
  name: process.env.APP_NAME ?? 'Simple Banking App',
  port: process.env.APP_PORT ?? 3000,
  host: process.env.APP_HOST ?? 'localhost',
};

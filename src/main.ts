import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppConfig } from './config';
import { AppModule } from './app.module';
import { AppDataSource } from './db/data-source';

const { name, port, host } = AppConfig;

const logger = new Logger(name);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppDataSource.initialize()
    .then((ds) => ds.runMigrations({ transaction: 'all' }))
    .catch((e) => logger.error(`Error initializing database: ${e}`));
  await app.listen(port, host);
}
bootstrap().then(() => logger.log(`Server started on ${host}:${port}`));

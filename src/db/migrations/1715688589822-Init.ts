import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1715688589822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users
                             (
                                 id              uuid                     NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY REFERENCES incoming_funds (account_id),
                                 first_name      VARCHAR(255)             NOT NULL,
                                 last_name       VARCHAR(255)             NOT NULL,
                                 email           VARCHAR(255)             NOT NULL UNIQUE,
                                 hashed_password VARCHAR(255)             NOT NULL,
                                 created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                             )`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS accounts
                             (
                                 id         uuid                     NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
                                 user_id    uuid                     NOT NULL REFERENCES users (id),
                                 balance    BIGINT                   NOT NULL DEFAULT 0,
                                 created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                             )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS incoming_funds
                             (
                                 id                  uuid                     NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
                                 account_id          uuid                     NOT NULL REFERENCES accounts (id),
                                 amount              BIGINT                   NOT NULL DEFAULT 0,
                                 settlement_datetime TIMESTAMP                NOT NULL,
                                 created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                             )`);

    await queryRunner.query(` CREATE TABLE IF NOT EXISTS settled_funds
                              (
                                  id               uuid                     NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
                                  incoming_fund_id uuid                     NOT NULL REFERENCES incoming_funds (id),
                                  amount           BIGINT                   NOT NULL DEFAULT 0,
                                  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                              );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS settled_funds`);
    await queryRunner.query(`DROP TABLE IF EXISTS incoming_funds`);
    await queryRunner.query(`DROP TABLE IF EXISTS accounts`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}

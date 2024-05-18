import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, IncomingFund, SettledFund, User } from '../../db/entities';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Account, IncomingFund, SettledFund, User]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

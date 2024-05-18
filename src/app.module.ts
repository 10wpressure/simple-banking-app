import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config';
import { AccountModule } from './modules/account/account.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 10,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    AccountModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}

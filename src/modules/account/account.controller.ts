import { Controller, Get, Query } from '@nestjs/common';
import { AccountService, GetAccountBalanceRequest } from './account.service';
import { Interval } from '@nestjs/schedule';

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get('balance')
  async getAccountBalance(
    @Query() request: GetAccountBalanceRequest,
  ): Promise<{ balance: string }> {
    return this.appService.getAccountBalance(request);
  }

  @Interval(10000)
  async settleBalances(): Promise<void> {
    await this.appService.settleBalances();
  }
}

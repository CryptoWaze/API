import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../../infrastructure/blockchain/clickhouse/clickhouse.module';
import { CoingeckoModule } from '../../infrastructure/coingecko/coingecko.module';
import { TokenUpdateCronService } from './token-update-cron.service';

@Module({
  imports: [ClickHouseModule, CoingeckoModule],
  providers: [TokenUpdateCronService],
})
export class TokensModule {}

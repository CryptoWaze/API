import { Module } from '@nestjs/common';
import { GetTopTokensUseCase } from '../../application/use-cases/get-top-tokens.use-case';
import { ClickHouseModule } from '../../infrastructure/blockchain/clickhouse/clickhouse.module';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { CoingeckoModule } from '../../infrastructure/coingecko/coingecko.module';
import { TokenUpdateCronService } from './token-update-cron.service';
import { TokensController } from './tokens.controller';

@Module({
  imports: [ClickHouseModule, CoingeckoModule, PrismaModule],
  controllers: [TokensController],
  providers: [TokenUpdateCronService, GetTopTokensUseCase],
})
export class TokensModule {}

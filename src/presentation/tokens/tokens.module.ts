import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { CoingeckoModule } from '../../infrastructure/coingecko/coingecko.module';
import { TokenUpdateCronService } from './token-update-cron.service';

@Module({
  imports: [PrismaModule, CoingeckoModule],
  providers: [TokenUpdateCronService],
})
export class TokensModule {}

import { Module } from '@nestjs/common';
import { CoingeckoApiService } from './coingecko-api.service';

@Module({
  providers: [CoingeckoApiService],
  exports: [CoingeckoApiService],
})
export class CoingeckoModule {}

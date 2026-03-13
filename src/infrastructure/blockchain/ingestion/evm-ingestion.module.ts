import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlchemyModule } from '../alchemy/alchemy.module';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { EvmIngestionStateRepository } from './evm-ingestion-state.repository';
import { EvmIngestionService } from './evm-ingestion.service';
import { EvmBlockIngestionService } from './evm-block-ingestion.service';

@Module({
  imports: [ConfigModule, AlchemyModule, ClickHouseModule],
  providers: [
    EvmIngestionStateRepository,
    EvmIngestionService,
    EvmBlockIngestionService,
  ],
  exports: [EvmBlockIngestionService, EvmIngestionService],
})
export class EvmIngestionModule {}


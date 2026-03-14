import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlchemyModule } from '../alchemy/alchemy.module';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { PrismaModule } from '../../database/prisma.module';
import { EvmIngestionStateRepository } from './evm-ingestion-state.repository';
import { EvmIngestionService } from './evm-ingestion.service';
import { EvmBlockIngestionService } from './evm-block-ingestion.service';
import { EvmSchemaRepository } from './evm-schema.repository';
import { CatalogSyncService } from './catalog-sync.service';
import { EvmDailyIngestionJobService } from './evm-daily-ingestion-job.service';

@Module({
  imports: [ConfigModule, AlchemyModule, ClickHouseModule, PrismaModule],
  providers: [
    EvmIngestionStateRepository,
    EvmSchemaRepository,
    EvmIngestionService,
    EvmBlockIngestionService,
    CatalogSyncService,
    EvmDailyIngestionJobService,
  ],
  exports: [EvmBlockIngestionService, EvmIngestionService, CatalogSyncService],
})
export class EvmIngestionModule {}


import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../../infrastructure/blockchain/clickhouse/clickhouse.module';
import { BlockchainDataQueryService } from '../../infrastructure/blockchain/blockchain-data-query.service';
import { BlockchainDataController } from './blockchain-data.controller';
import { BlockchainIngestionController } from './blockchain-ingestion.controller';
import { EvmIngestionModule } from '../../infrastructure/blockchain/ingestion/evm-ingestion.module';

@Module({
  imports: [EvmIngestionModule, ClickHouseModule],
  controllers: [BlockchainDataController, BlockchainIngestionController],
  providers: [BlockchainDataQueryService],
})
export class BlockchainDataModule {}

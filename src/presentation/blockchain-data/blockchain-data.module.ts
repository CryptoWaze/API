import { Module } from '@nestjs/common';
import { BlockchainDataController } from './blockchain-data.controller';
import { BlockchainIngestionController } from './blockchain-ingestion.controller';
import { EvmIngestionModule } from '../../infrastructure/blockchain/ingestion/evm-ingestion.module';

@Module({
  imports: [EvmIngestionModule],
  controllers: [BlockchainDataController, BlockchainIngestionController],
})
export class BlockchainDataModule {}

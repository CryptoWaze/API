import { Module } from '@nestjs/common';
import { BlockchainDataController } from './blockchain-data.controller';

@Module({
  imports: [],
  controllers: [BlockchainDataController],
})
export class BlockchainDataModule {}

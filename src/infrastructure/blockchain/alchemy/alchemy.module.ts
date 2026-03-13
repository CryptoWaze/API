import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlchemyEvmRpcClient } from './alchemy-evm-rpc.client';

@Module({
  imports: [ConfigModule],
  providers: [AlchemyEvmRpcClient],
  exports: [AlchemyEvmRpcClient],
})
export class AlchemyModule {}


import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database';
import { GetChainsUseCase } from '../../application/use-cases/get-chains.use-case';
import { ChainsController } from './chains.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChainsController],
  providers: [GetChainsUseCase],
})
export class ChainsModule {}

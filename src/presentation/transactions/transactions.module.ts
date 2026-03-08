import { Module } from '@nestjs/common';
import { CovalentModule } from '../../infrastructure/covalent';
import { ResolveTransactionUseCase } from '../../application/use-cases/resolve-transaction.use-case';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [CovalentModule],
  controllers: [TransactionsController],
  providers: [ResolveTransactionUseCase],
  exports: [ResolveTransactionUseCase],
})
export class TransactionsModule {}

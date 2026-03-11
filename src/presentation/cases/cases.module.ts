import { Module } from '@nestjs/common';
import { AuthModule } from '../../infrastructure/auth';
import { AddressesModule } from '../addresses/addresses.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SocketModule } from '../socket/socket.module';
import { CreateCaseUseCase } from '../../application/use-cases/create-case.use-case';
import { GetCaseByIdUseCase } from '../../application/use-cases/get-case-by-id.use-case';
import { GetCasesHistoryByUserIdUseCase } from '../../application/use-cases/get-cases-history-by-user-id.use-case';
import { UpdateFlowWalletUseCase } from '../../application/use-cases/update-flow-wallet.use-case';
import { UpdateCaseUseCase } from '../../application/use-cases/update-case.use-case';
import { SoftDeleteFlowUseCase } from '../../application/use-cases/soft-delete-flow.use-case';
import { SoftDeleteFlowTransactionUseCase } from '../../application/use-cases/soft-delete-flow-transaction.use-case';
import { EditCaseUseCase } from '../../application/use-cases/edit-case.use-case';
import { CasesController } from './cases.controller';

@Module({
  imports: [AuthModule, AddressesModule, TransactionsModule, SocketModule],
  controllers: [CasesController],
  providers: [
    CreateCaseUseCase,
    GetCaseByIdUseCase,
    GetCasesHistoryByUserIdUseCase,
    UpdateFlowWalletUseCase,
    UpdateCaseUseCase,
    SoftDeleteFlowUseCase,
    SoftDeleteFlowTransactionUseCase,
    EditCaseUseCase,
  ],
})
export class CasesModule {}

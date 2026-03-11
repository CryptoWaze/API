import { Module } from '@nestjs/common';
import { AuthModule } from '../../infrastructure/auth';
import { AddressesModule } from '../addresses/addresses.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SocketModule } from '../socket/socket.module';
import { CreateCaseUseCase } from '../../application/use-cases/create-case.use-case';
import { GetCaseByIdUseCase } from '../../application/use-cases/get-case-by-id.use-case';
import { GetCasesHistoryByUserIdUseCase } from '../../application/use-cases/get-cases-history-by-user-id.use-case';
import { UpdateFlowWalletUseCase } from '../../application/use-cases/update-flow-wallet.use-case';
import { CasesController } from './cases.controller';

@Module({
  imports: [AuthModule, AddressesModule, TransactionsModule, SocketModule],
  controllers: [CasesController],
  providers: [
    CreateCaseUseCase,
    GetCaseByIdUseCase,
    GetCasesHistoryByUserIdUseCase,
    UpdateFlowWalletUseCase,
  ],
})
export class CasesModule {}

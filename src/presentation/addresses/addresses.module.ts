import { Module } from '@nestjs/common';
import { CovalentModule } from '../../infrastructure/covalent';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import { GetAddressTopTransfersPaginatedUseCase } from '../../application/use-cases/get-address-top-transfers-paginated.use-case';
import { GetAddressTopTransfersHistoryUseCase } from '../../application/use-cases/get-address-top-transfers-history.use-case';
import { FollowFlowToExchangeUseCase } from '../../application/use-cases/follow-flow-to-exchange.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from '../../application/use-cases/follow-flow-to-exchange-full-history.use-case';
import { FlowToExchangeFromTransactionUseCase } from '../../application/use-cases/flow-to-exchange-from-transaction.use-case';
import { SocketModule } from '../socket/socket.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [CovalentModule, PrismaModule, SocketModule, TransactionsModule],
  controllers: [AddressesController],
  providers: [
    GetAddressTopTransfersUseCase,
    GetAddressTopTransfersPaginatedUseCase,
    GetAddressTopTransfersHistoryUseCase,
    FollowFlowToExchangeUseCase,
    FollowFlowToExchangeFullHistoryUseCase,
    FlowToExchangeFromTransactionUseCase,
  ],
  exports: [FollowFlowToExchangeFullHistoryUseCase],
})
export class AddressesModule {}

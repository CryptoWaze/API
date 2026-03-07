import { Module } from '@nestjs/common';
import { CovalentModule } from '../../infrastructure/covalent';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import { GetAddressTopTransfersPaginatedUseCase } from '../../application/use-cases/get-address-top-transfers-paginated.use-case';
import { GetAddressTopTransfersHistoryUseCase } from '../../application/use-cases/get-address-top-transfers-history.use-case';
import { FollowFlowToExchangeUseCase } from '../../application/use-cases/follow-flow-to-exchange.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from '../../application/use-cases/follow-flow-to-exchange-full-history.use-case';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [CovalentModule],
  controllers: [AddressesController],
  providers: [
    GetAddressTopTransfersUseCase,
    GetAddressTopTransfersPaginatedUseCase,
    GetAddressTopTransfersHistoryUseCase,
    FollowFlowToExchangeUseCase,
    FollowFlowToExchangeFullHistoryUseCase,
  ],
})
export class AddressesModule {}

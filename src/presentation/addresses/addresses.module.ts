import { Module } from '@nestjs/common';
import { CovalentModule } from '../../infrastructure/covalent';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [CovalentModule],
  controllers: [AddressesController],
  providers: [GetAddressTopTransfersUseCase],
})
export class AddressesModule {}

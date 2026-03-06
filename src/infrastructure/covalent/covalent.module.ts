import { Module } from '@nestjs/common';
import { TRANSACTION_FETCHER } from '../../application/ports/transaction-fetcher.port';
import { ADDRESS_TRANSFERS_FETCHER } from '../../application/ports/address-transfers-fetcher.port';
import { CovalentApiService } from './covalent-api.service';

@Module({
  providers: [
    CovalentApiService,
    {
      provide: TRANSACTION_FETCHER,
      useExisting: CovalentApiService,
    },
    {
      provide: ADDRESS_TRANSFERS_FETCHER,
      useExisting: CovalentApiService,
    },
  ],
  exports: [TRANSACTION_FETCHER, ADDRESS_TRANSFERS_FETCHER],
})
export class CovalentModule {}

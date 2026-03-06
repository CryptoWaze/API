import { Module } from '@nestjs/common';
import { TRANSACTION_FETCHER } from '../../application/ports/transaction-fetcher.port';
import { CovalentApiService } from './covalent-api.service';

@Module({
  providers: [
    CovalentApiService,
    {
      provide: TRANSACTION_FETCHER,
      useExisting: CovalentApiService,
    },
  ],
  exports: [TRANSACTION_FETCHER],
})
export class CovalentModule {}

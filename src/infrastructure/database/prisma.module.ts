import { Global, Module } from '@nestjs/common';
import { HOT_WALLET_CHECKER } from '../../application/ports/hot-wallet-checker.port';
import { DatabaseService } from './database.service';
import { HotWalletCheckerService } from './hot-wallet-checker.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    DatabaseService,
    HotWalletCheckerService,
    {
      provide: HOT_WALLET_CHECKER,
      useExisting: HotWalletCheckerService,
    },
  ],
  exports: [PrismaService, DatabaseService, HOT_WALLET_CHECKER],
})
export class PrismaModule {}

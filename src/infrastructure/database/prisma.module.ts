import { Global, Module } from '@nestjs/common';
import { FLOW_TRACE_LOG_WRITER } from '../../application/ports/flow-trace-log-writer.port';
import { HOT_WALLET_CHECKER } from '../../application/ports/hot-wallet-checker.port';
import { TOKEN_PRICE_PROVIDER } from '../../application/ports/token-price-provider.port';
import { DatabaseService } from './database.service';
import { FlowTraceLogWriterService } from './flow-trace-log-writer.service';
import { HotWalletCheckerService } from './hot-wallet-checker.service';
import { PrismaService } from './prisma.service';
import { TokenPriceProviderService } from './token-price-provider.service';

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
    FlowTraceLogWriterService,
    {
      provide: FLOW_TRACE_LOG_WRITER,
      useExisting: FlowTraceLogWriterService,
    },
    TokenPriceProviderService,
    {
      provide: TOKEN_PRICE_PROVIDER,
      useExisting: TokenPriceProviderService,
    },
  ],
  exports: [
    PrismaService,
    DatabaseService,
    HOT_WALLET_CHECKER,
    FLOW_TRACE_LOG_WRITER,
    TOKEN_PRICE_PROVIDER,
  ],
})
export class PrismaModule {}

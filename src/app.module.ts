import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HelloModule } from './presentation/hello';
import { UsersModule } from './presentation/users';
import { TransactionsModule } from './presentation/transactions';
import { AddressesModule } from './presentation/addresses/addresses.module';
import { SocketModule } from './presentation/socket';
import { CasesModule } from './presentation/cases';
import { TokensModule } from './presentation/tokens';
import { BlockchainDataModule } from './presentation/blockchain-data/blockchain-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HelloModule,
    UsersModule,
    TransactionsModule,
    AddressesModule,
    SocketModule,
    CasesModule,
    TokensModule,
    BlockchainDataModule,
  ],
})
export class AppModule {}

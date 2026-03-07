import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './presentation/hello';
import { UsersModule } from './presentation/users';
import { TransactionsModule } from './presentation/transactions';
import { AddressesModule } from './presentation/addresses/addresses.module';
import { SocketModule } from './presentation/socket';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelloModule,
    UsersModule,
    TransactionsModule,
    AddressesModule,
    SocketModule,
  ],
})
export class AppModule {}

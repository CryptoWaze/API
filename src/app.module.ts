import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './presentation/hello';
import { UsersModule } from './presentation/users';
import { TransactionsModule } from './presentation/transactions';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelloModule,
    UsersModule,
    TransactionsModule,
  ],
})
export class AppModule {}

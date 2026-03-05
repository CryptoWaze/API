import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './presentation/hello';
import { UsersModule } from './presentation/users';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelloModule,
    UsersModule,
  ],
})
export class AppModule {}

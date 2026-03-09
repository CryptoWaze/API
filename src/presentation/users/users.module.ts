import { Module } from '@nestjs/common';
import { AuthModule } from '../../infrastructure/auth';
import { PrismaModule } from '../../infrastructure/database';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

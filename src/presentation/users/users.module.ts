import { Module } from '@nestjs/common';
import { AuthModule } from '../../infrastructure/auth';
import { PrismaModule } from '../../infrastructure/database';
import { GetUserDashboardUseCase } from '../../application/use-cases/get-user-dashboard.use-case';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, GetUserDashboardUseCase],
  exports: [UsersService],
})
export class UsersModule {}

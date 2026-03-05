import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { loginUserSchema } from '../../application/schemas/login-user.schema';
import { registerUserSchema } from '../../application/schemas/register-user.schema';
import { UsersService, UserResponse } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: unknown): Promise<UserResponse> {
    const result = loginUserSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      throw new BadRequestException(messages);
    }
    return this.usersService.login(result.data);
  }

  @Post('register')
  async register(@Body() body: unknown): Promise<UserResponse> {
    const result = registerUserSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      throw new BadRequestException(messages);
    }
    return this.usersService.register(result.data);
  }
}

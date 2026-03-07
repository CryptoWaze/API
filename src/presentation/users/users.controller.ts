import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginUserSchema } from '../../application/schemas/login-user.schema';
import { registerUserSchema } from '../../application/schemas/register-user.schema';
import { UsersService, UserResponse } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  async login(@Body() body: unknown): Promise<UserResponse> {
    const result = loginUserSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.usersService.login(result.data);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async register(@Body() body: unknown): Promise<UserResponse> {
    const result = registerUserSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.usersService.register(result.data);
  }
}

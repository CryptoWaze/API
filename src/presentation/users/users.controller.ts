import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginUserSchema } from '../../application/schemas/login-user.schema';
import { registerUserSchema } from '../../application/schemas/register-user.schema';
import { GetUserDashboardUseCase } from '../../application/use-cases/get-user-dashboard.use-case';
import { CurrentUser, JwtAuthGuard } from '../../infrastructure/auth';
import { UsersService, UserResponse } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly getUserDashboardUseCase: GetUserDashboardUseCase,
  ) {}

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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Dashboard do usuário',
    description:
      'Retorna totais (casos, valor rastreado em USD, casos este mês, transações rastreadas) e histórico de casos. Apenas o próprio usuário pode consultar.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário (deve ser o mesmo do token)' })
  @ApiResponse({
    status: 200,
    description:
      'Dashboard com totalCases, totalTrackedValueUSD, casesThisMonth, totalTrackedTransactions e caseHistory.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Só é permitido consultar o próprio dashboard.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getDashboard(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    if (id !== user.userId) {
      throw new ForbiddenException(
        'Só é permitido consultar o próprio dashboard.',
      );
    }
    return this.getUserDashboardUseCase.execute(id);
  }
}

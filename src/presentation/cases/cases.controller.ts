import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createCaseSchema } from '../../application/schemas/create-case.schema';
import { CreateCaseUseCase } from '../../application/use-cases/create-case.use-case';
import { GetCaseByIdUseCase } from '../../application/use-cases/get-case-by-id.use-case';
import { CurrentUser, JwtAuthGuard } from '../../infrastructure/auth';

@ApiTags('cases')
@Controller('cases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class CasesController {
  constructor(
    private readonly createCaseUseCase: CreateCaseUseCase,
    private readonly getCaseByIdUseCase: GetCaseByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Criar caso',
    description:
      'Cria um caso com N sementes (hash + valor). Retorna imediatamente 202 com traceId, caseId e seedsCount. O rastreio roda em background. Inscreva-se no socket com subscribe-flow-trace em traceId, traceId-0, traceId-1, ... (traceId vem na resposta). Progresso de cada hash em traceId-0, traceId-1, ...; evento case-created em traceId quando terminar.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'seeds'],
      properties: {
        name: { type: 'string', description: 'Nome do caso' },
        seeds: {
          type: 'array',
          items: {
            type: 'object',
            required: ['txHash', 'reportedLossAmount'],
            properties: {
              txHash: { type: 'string', description: 'Hash da transação' },
              reportedLossAmount: {
                type: 'number',
                description: 'Valor reportado da transferência',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description:
      'Aceito. Retorna traceId (gerado pelo backend), caseId e seedsCount. Inscreva-se no socket com esse traceId para progresso (traceId-0, traceId-1, ...) e case-created (traceId).',
  })
  @ApiResponse({
    status: 400,
    description: 'Body inválido (nome vazio, seeds vazio ou inválido).',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado. Envie o token no header Authorization.' })
  async create(
    @Body() body: unknown,
    @CurrentUser() user: { userId: string },
  ) {
    const result = createCaseSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.createCaseUseCase.execute(result.data, user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar caso por ID',
    description:
      'Retorna o caso completo: dados do caso, sementes (transações iniciais), flows (rastreios), transações do path e arestas do grafo para montar o fluxograma.',
  })
  @ApiParam({ name: 'id', description: 'ID do caso (cuid)' })
  @ApiResponse({
    status: 200,
    description:
      'Caso encontrado. Inclui seeds, flows, flows.transactions (path), flows.edges (grafo completo).',
  })
  @ApiResponse({ status: 404, description: 'Caso não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Envie o token no header Authorization.' })
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.getCaseByIdUseCase.execute(id, user.userId);
  }
}

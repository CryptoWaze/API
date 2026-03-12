import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createCaseSchema } from '../../application/schemas/create-case.schema';
import { updateFlowWalletSchema } from '../../application/schemas/update-flow-wallet.schema';
import { updateCaseSchema } from '../../application/schemas/update-case.schema';
import { editCaseSchema } from '../../application/schemas/edit-case.schema';
import { CreateCaseUseCase } from '../../application/use-cases/create-case.use-case';
import { GetCaseByIdUseCase } from '../../application/use-cases/get-case-by-id.use-case';
import { GetCasesHistoryByUserIdUseCase } from '../../application/use-cases/get-cases-history-by-user-id.use-case';
import { UpdateFlowWalletUseCase } from '../../application/use-cases/update-flow-wallet.use-case';
import { UpdateCaseUseCase } from '../../application/use-cases/update-case.use-case';
import { SoftDeleteFlowUseCase } from '../../application/use-cases/soft-delete-flow.use-case';
import { SoftDeleteFlowTransactionUseCase } from '../../application/use-cases/soft-delete-flow-transaction.use-case';
import { EditCaseUseCase } from '../../application/use-cases/edit-case.use-case';
import { GetOrCreateCaseReportUseCase } from '../../application/use-cases/get-or-create-case-report.use-case';
import { ListCaseReportsUseCase } from '../../application/use-cases/list-case-reports.use-case';
import { GetCaseReportFileUseCase } from '../../application/use-cases/get-case-report-file.use-case';
import { CurrentUser, JwtAuthGuard } from '../../infrastructure/auth';
import { StreamableFile } from '@nestjs/common';

@ApiTags('cases')
@Controller('cases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class CasesController {
  constructor(
    private readonly createCaseUseCase: CreateCaseUseCase,
    private readonly getCaseByIdUseCase: GetCaseByIdUseCase,
    private readonly getCasesHistoryByUserIdUseCase: GetCasesHistoryByUserIdUseCase,
    private readonly updateFlowWalletUseCase: UpdateFlowWalletUseCase,
    private readonly updateCaseUseCase: UpdateCaseUseCase,
    private readonly softDeleteFlowUseCase: SoftDeleteFlowUseCase,
    private readonly softDeleteFlowTransactionUseCase: SoftDeleteFlowTransactionUseCase,
    private readonly editCaseUseCase: EditCaseUseCase,
    private readonly getOrCreateCaseReportUseCase: GetOrCreateCaseReportUseCase,
    private readonly listCaseReportsUseCase: ListCaseReportsUseCase,
    private readonly getCaseReportFileUseCase: GetCaseReportFileUseCase,
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
        mode: {
          type: 'string',
          enum: ['basic', 'advanced'],
          description:
            'Tipo de rastreio: "basic" (1 fluxo principal por seed) ou "advanced" (fluxos adicionais por branching). Padrão: advanced.',
        },
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

  @Get('history/:userId')
  @ApiOperation({
    summary: 'Histórico de casos do usuário',
    description:
      'Retorna nome e valor total perdido de cada caso do usuário, ordenado por data de criação (mais recente primeiro). Só é possível consultar o próprio histórico (userId do path deve ser o do token).',
  })
  @ApiParam({ name: 'userId', description: 'ID do usuário (deve ser o mesmo do token)' })
  @ApiResponse({
    status: 200,
    description:
      'Lista de casos com id, name, totalAmountLostRaw e totalAmountLostDecimal.',
  })
  @ApiResponse({
    status: 403,
    description: 'Só é permitido consultar o histórico do próprio usuário.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado. Envie o token no header Authorization.' })
  async getHistory(
    @Param('userId') userId: string,
    @CurrentUser() user: { userId: string },
  ) {
    if (userId !== user.userId) {
      throw new ForbiddenException(
        'Só é permitido consultar o histórico do próprio usuário.',
      );
    }
    return this.getCasesHistoryByUserIdUseCase.execute(user.userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Editar caso (metadados)',
    description:
      'Permite editar propriedades do caso, como o nome. Apenas o dono do caso pode editar.',
  })
  @ApiParam({ name: 'id', description: 'ID do caso (cuid)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Novo nome do caso' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Caso atualizado.' })
  @ApiResponse({ status: 400, description: 'Body inválido.' })
  @ApiResponse({ status: 404, description: 'Caso não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async updateCase(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { userId: string },
  ) {
    const result = updateCaseSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.updateCaseUseCase.execute(id, user.userId, result.data);
  }

  @Patch(':id/edit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Editar caso (bulk)',
    description:
      'Endpoint único para edição em lote do caso: renomear caso, editar carteiras (nickname/position) e apagar fluxos/transações via soft delete.',
  })
  @ApiParam({ name: 'id', description: 'ID do caso (cuid)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Novo nome do caso' },
        wallets: {
          type: 'array',
          items: {
            type: 'object',
            required: ['walletId'],
            properties: {
              walletId: { type: 'string' },
              nickname: {
                type: 'string',
                nullable: true,
                description: 'Apelido da carteira (null para limpar)',
              },
              position: {
                oneOf: [
                  { type: 'string', enum: ['default'] },
                  {
                    type: 'object',
                    properties: {
                      x: { type: 'number' },
                      y: { type: 'number' },
                    },
                    required: ['x', 'y'],
                  },
                ],
                description: 'Posição no fluxograma: "default" ou { x, y }',
              },
            },
          },
        },
        softDeleteFlows: {
          type: 'array',
          items: {
            type: 'object',
            required: ['flowId'],
            properties: {
              flowId: { type: 'string' },
            },
          },
        },
        softDeleteTransactions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['flowId', 'transactionId'],
            properties: {
              flowId: { type: 'string' },
              transactionId: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Edição aplicada. Retorna ids de carteiras/fluxos/transações tocados.',
  })
  @ApiResponse({ status: 400, description: 'Body inválido.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async editCase(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { userId: string },
  ) {
    const result = editCaseSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.editCaseUseCase.execute(id, user.userId, result.data);
  }

  @Patch(':caseId/wallets/:walletId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Editar carteira de um fluxo',
    description:
      'Atualiza nickname e/ou position de uma carteira (FlowWallet) de um fluxo do caso. Só o dono do caso pode editar.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiParam({ name: 'walletId', description: 'ID da carteira do fluxo (FlowWallet)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          nullable: true,
          description: 'Apelido da carteira (null para limpar)',
        },
        position: {
          oneOf: [
            { type: 'string', enum: ['default'] },
            {
              type: 'object',
              properties: { x: { type: 'number' }, y: { type: 'number' } },
              required: ['x', 'y'],
            },
          ],
          description: 'Posição no fluxograma: "default" ou { x, y }',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Carteira atualizada.' })
  @ApiResponse({ status: 400, description: 'Body inválido.' })
  @ApiResponse({ status: 403, description: 'Caso não pertence ao usuário.' })
  @ApiResponse({ status: 404, description: 'Caso ou carteira não encontrados.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async updateFlowWallet(
    @Param('caseId') caseId: string,
    @Param('walletId') walletId: string,
    @Body() body: unknown,
    @CurrentUser() user: { userId: string },
  ) {
    const result = updateFlowWalletSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.updateFlowWalletUseCase.execute(
      caseId,
      walletId,
      user.userId,
      result.data,
    );
  }

  @Patch(':caseId/flows/:flowId/soft-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Apagar fluxo (soft delete)',
    description:
      'Marca um fluxo inteiro como removido (soft delete), incluindo suas transações e arestas. Apenas o dono do caso pode apagar.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiParam({ name: 'flowId', description: 'ID do fluxo' })
  @ApiResponse({ status: 200, description: 'Fluxo apagado (soft delete).' })
  @ApiResponse({ status: 404, description: 'Fluxo ou caso não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async softDeleteFlow(
    @Param('caseId') caseId: string,
    @Param('flowId') flowId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.softDeleteFlowUseCase.execute(caseId, flowId, user.userId);
  }

  @Patch(':caseId/flows/:flowId/transactions/:transactionId/soft-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Apagar transação de fluxo (soft delete)',
    description:
      'Marca uma transação específica de um fluxo como removida (soft delete) e, opcionalmente, as arestas associadas. Apenas o dono do caso pode apagar.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiParam({ name: 'flowId', description: 'ID do fluxo' })
  @ApiParam({ name: 'transactionId', description: 'ID da transação do fluxo' })
  @ApiResponse({ status: 200, description: 'Transação apagada (soft delete).' })
  @ApiResponse({
    status: 404,
    description: 'Transação, fluxo ou caso não encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async softDeleteFlowTransaction(
    @Param('caseId') caseId: string,
    @Param('flowId') flowId: string,
    @Param('transactionId') transactionId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.softDeleteFlowTransactionUseCase.execute(
      caseId,
      flowId,
      transactionId,
      user.userId,
    );
  }

  @Post(':caseId/reports')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter ou gerar relatório do caso',
    description:
      'Se não existir relatório ou o caso foi editado após o último relatório, gera um novo (PDF e DOCX) e retorna. Caso contrário, retorna o relatório existente mais recente.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiResponse({
    status: 200,
    description:
      'Relatório(s) existente(s) ou recém-gerado(s). Campo generated indica se foi gerado agora (true) ou já existia (false).',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Caso não encontrado.' })
  async getOrCreateReport(
    @Param('caseId') caseId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.getOrCreateCaseReportUseCase.execute(caseId, user.userId);
  }

  @Get(':caseId/reports')
  @ApiOperation({
    summary: 'Listar relatórios do caso',
    description: 'Retorna todos os relatórios do caso (histórico), ordenados do mais recente ao mais antigo.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de relatórios com id, format, generatedAt, createdAt.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Caso não encontrado.' })
  async listReports(
    @Param('caseId') caseId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.listCaseReportsUseCase.execute(caseId, user.userId);
  }

  @Get(':caseId/reports/:reportId')
  @ApiOperation({
    summary: 'Download de relatório',
    description: 'Retorna o arquivo do relatório (PDF ou DOCX) para download.',
  })
  @ApiParam({ name: 'caseId', description: 'ID do caso' })
  @ApiParam({ name: 'reportId', description: 'ID do relatório' })
  @ApiResponse({
    status: 200,
    description: 'Arquivo do relatório (application/pdf ou application/vnd.openxmlformats-officedocument.wordprocessingml.document).',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Caso ou relatório não encontrado.' })
  async getReportFile(
    @Param('caseId') caseId: string,
    @Param('reportId') reportId: string,
    @CurrentUser() user: { userId: string },
  ) {
    const result = await this.getCaseReportFileUseCase.execute(
      caseId,
      reportId,
      user.userId,
    );
    return new StreamableFile(result.body, {
      type: result.contentType,
      disposition: `attachment; filename="${result.fileName}"`,
    });
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

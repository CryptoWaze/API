import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resolveTransactionSchema } from '../../application/schemas/resolve-transaction.schema';
import { ResolveTransactionUseCase } from '../../application/use-cases/resolve-transaction.use-case';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly resolveTransactionUseCase: ResolveTransactionUseCase,
  ) {}

  @Post('resolve')
  @ApiOperation({
    summary: 'Resolver hash de transação',
    description:
      'Busca a transação em múltiplas chains e identifica a transferência semente pelo valor informado.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['txHash'],
      properties: {
        txHash: { type: 'string', description: 'Hash da transação' },
        reportedLossAmount: {
          type: 'number',
          description: 'Valor reportado de perda (opcional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Transação encontrada e transferência semente identificada.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada em nenhuma chain.' })
  async resolve(@Body() body: unknown) {
    const result = resolveTransactionSchema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.resolveTransactionUseCase.execute(result.data);
  }
}

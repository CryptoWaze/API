import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { resolveTransactionSchema } from '../../application/schemas/resolve-transaction.schema';
import { ResolveTransactionUseCase } from '../../application/use-cases/resolve-transaction.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly resolveTransactionUseCase: ResolveTransactionUseCase,
  ) {}

  @Post('resolve')
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

import { Injectable, NotFoundException } from '@nestjs/common';
import type { FlowToExchangeFromTransactionInput } from '../schemas/flow-to-exchange-from-transaction.schema';
import type { FollowFlowToExchangeFullHistoryResult } from '../types';
import { FollowFlowToExchangeFullHistoryUseCase } from './follow-flow-to-exchange-full-history.use-case';
import { ResolveTransactionUseCase } from './resolve-transaction.use-case';
import { chainToSlug } from '../utils/blockchain.utils';

@Injectable()
export class FlowToExchangeFromTransactionUseCase {
  constructor(
    private readonly resolveTransactionUseCase: ResolveTransactionUseCase,
    private readonly followFlowToExchangeFullHistoryUseCase: FollowFlowToExchangeFullHistoryUseCase,
  ) {}

  async execute(
    input: FlowToExchangeFromTransactionInput,
  ): Promise<FollowFlowToExchangeFullHistoryResult> {
    const resolveResult = await this.resolveTransactionUseCase.execute({
      txHash: input.txHash,
      reportedLossAmount: input.reportedLossAmount,
    });

    const seedTransfer = resolveResult.seedTransfer;
    if (!seedTransfer) {
      throw new NotFoundException(
        'Não foi possível identificar a carteira de destino da transferência. Informe o valor reportado (reportedLossAmount) correspondente ao valor da transferência.',
      );
    }

    const chainSlug = chainToSlug(resolveResult.chain);
    const startAddress = seedTransfer.to.trim().toLowerCase();

    return this.followFlowToExchangeFullHistoryUseCase.execute({
      address: startAddress,
      chain: chainSlug,
      traceId: input.traceId,
      minTimestamp: seedTransfer.timestamp ?? undefined,
    });
  }
}

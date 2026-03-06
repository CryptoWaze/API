import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ResolveTransactionInput } from '../schemas/resolve-transaction.schema';
import type { ResolveTransactionResult } from '../types';
import {
  TRANSACTION_FETCHER,
  type ITransactionFetcher,
} from '../ports/transaction-fetcher.port';
import type { Transfer } from '../types';

const CHAINS = ['eth-mainnet', 'bsc-mainnet'];

function pickTransferByReportedAmount(
  transfers: Transfer[],
  reportedAmount: number | undefined,
): Transfer | null {
  if (transfers.length === 0) return null;
  if (
    reportedAmount == null ||
    typeof reportedAmount !== 'number' ||
    !Number.isFinite(reportedAmount)
  ) {
    return null;
  }
  let best = transfers[0];
  let bestDiff = Math.abs(transfers[0].amount - reportedAmount);
  for (let i = 1; i < transfers.length; i++) {
    const diff = Math.abs(transfers[i].amount - reportedAmount);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = transfers[i];
    }
  }
  return best;
}

@Injectable()
export class ResolveTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_FETCHER)
    private readonly transactionFetcher: ITransactionFetcher,
  ) {}

  async execute(
    input: ResolveTransactionInput,
  ): Promise<ResolveTransactionResult> {
    const { txHash, reportedLossAmount } = input;
    const normalizedHash = txHash.trim();

    for (const chain of CHAINS) {
      const data = await this.transactionFetcher.getTransactionWithTransfers(
        chain,
        normalizedHash,
      );
      if (!data) continue;

      const seedTransfer = pickTransferByReportedAmount(
        data.transfers,
        reportedLossAmount ?? undefined,
      );

      return {
        chain,
        transaction: {
          fromAddress: data.fromAddress,
          toAddress: data.toAddress,
          blockSignedAt: data.blockSignedAt,
        },
        transfers: data.transfers,
        seedTransfer,
      };
    }

    throw new NotFoundException(
      `Transação não encontrada em nenhuma chain (${CHAINS.join(', ')}). Verifique o hash.`,
    );
  }
}

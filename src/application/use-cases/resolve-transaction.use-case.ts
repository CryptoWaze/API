import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { ResolveTransactionInput } from '../schemas/resolve-transaction.schema';
import type { ResolveTransactionResult } from '../types';
import {
  TRANSACTION_FETCHER,
  type ITransactionFetcher,
} from '../ports/transaction-fetcher.port';
import type { Transfer } from '../types';
import { RESOLVE_AND_ADDRESS_CHAINS } from '../constants/domain.constants';

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
  private readonly logger = new Logger(ResolveTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_FETCHER)
    private readonly transactionFetcher: ITransactionFetcher,
  ) {}

  async execute(
    input: ResolveTransactionInput,
  ): Promise<ResolveTransactionResult> {
    try {
      const { txHash, reportedLossAmount } = input;
      const normalizedHash = txHash.trim();

      for (const chain of RESOLVE_AND_ADDRESS_CHAINS) {
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
        `Transação não encontrada em nenhuma chain (${RESOLVE_AND_ADDRESS_CHAINS.join(', ')}). Verifique o hash.`,
      );
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`resolveTransaction failed: ${message}`);
      if (/Covalent API error: (500|502|503)/.test(message)) {
        throw new BadGatewayException(
          'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao resolver transação.',
      );
    }
  }
}

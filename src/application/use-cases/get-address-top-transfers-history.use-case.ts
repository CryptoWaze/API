import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { GetAddressTopTransfersHistoryInput } from '../schemas/get-address-top-transfers-history.schema';
import type {
  GetAddressTopTransfersHistoryResult,
  WalletTransfer,
} from '../types';
import {
  ADDRESS_TRANSFERS_FETCHER,
  type IAddressTransfersFetcher,
} from '../ports/address-transfers-fetcher.port';
import {
  ADDRESS_TOP_TRANSFERS_HISTORY_MAX_PAGES,
  ADDRESS_TOP_TRANSFERS_TOP_N,
} from '../constants/domain.constants';
import { toCovalentChainId } from '../utils/blockchain.utils';

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
function topOutboundByAmount(
  transfers: WalletTransfer[],
  n: number,
): WalletTransfer[] {
  const out = transfers.filter((t) => t.direction === 'OUT');
  const sorted = [...out].sort((a, b) =>
    BigInt(b.rawAmount) > BigInt(a.rawAmount) ? 1 : -1,
  );
  return sorted.slice(0, n);
}
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */

@Injectable()
export class GetAddressTopTransfersHistoryUseCase {
  private readonly logger = new Logger(
    GetAddressTopTransfersHistoryUseCase.name,
  );

  constructor(
    @Inject(ADDRESS_TRANSFERS_FETCHER)
    private readonly addressTransfersFetcher: IAddressTransfersFetcher,
  ) {}

  async execute(
    input: GetAddressTopTransfersHistoryInput,
  ): Promise<GetAddressTopTransfersHistoryResult> {
    try {
      const chainSlug = input.chain.trim();
      const covalentChainId = toCovalentChainId(chainSlug);
      const normalizedAddress = input.address.trim().toLowerCase();

      const allTransfers: WalletTransfer[] = [];
      for (let page = 0; page < ADDRESS_TOP_TRANSFERS_HISTORY_MAX_PAGES; page++) {
        const pageTransfers =
          await this.addressTransfersFetcher.getAddressTransfersPage(
            covalentChainId,
            normalizedAddress,
            page,
          );
        if (pageTransfers.length === 0) break;
        allTransfers.push(...pageTransfers);
      }

      const top = topOutboundByAmount(
        allTransfers,
        ADDRESS_TOP_TRANSFERS_TOP_N,
      );

      return {
        chain: chainSlug,
        transfers: top,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`getAddressTopTransfersHistory failed: ${message}`);
      if (/Covalent API error: (500|502|503)/.test(message)) {
        throw new BadGatewayException(
          'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao buscar histórico de transferências.',
      );
    }
  }
}

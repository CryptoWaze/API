import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { GetAddressTopTransfersPaginatedInput } from '../schemas/get-address-top-transfers-paginated.schema';
import type {
  GetAddressTopTransfersPaginatedResult,
  WalletTransfer,
} from '../types';
import {
  ADDRESS_TRANSFERS_FETCHER,
  type IAddressTransfersFetcher,
} from '../ports/address-transfers-fetcher.port';

const TOP_N = 3;

function toCovalentChainId(slug: string): string {
  return `${slug}-mainnet`;
}

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
export class GetAddressTopTransfersPaginatedUseCase {
  private readonly logger = new Logger(GetAddressTopTransfersPaginatedUseCase.name);

  constructor(
    @Inject(ADDRESS_TRANSFERS_FETCHER)
    private readonly addressTransfersFetcher: IAddressTransfersFetcher,
  ) {}

  async execute(
    input: GetAddressTopTransfersPaginatedInput,
  ): Promise<GetAddressTopTransfersPaginatedResult> {
    try {
      const chainSlug = input.chain.trim();
      const covalentChainId = toCovalentChainId(chainSlug);
      const normalizedAddress = input.address.trim().toLowerCase();
      const page = input.page;

      const transfers =
        await this.addressTransfersFetcher.getAddressTransfersPage(
          covalentChainId,
          normalizedAddress,
          page,
        );
      const top = topOutboundByAmount(transfers, TOP_N);

      return {
        chain: chainSlug,
        page,
        transfers: top,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`getAddressTransfersPaginated failed: ${message}`);
      if (/Covalent API error: (500|502|503)/.test(message)) {
        throw new BadGatewayException(
          'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao buscar transferências paginadas.',
      );
    }
  }
}

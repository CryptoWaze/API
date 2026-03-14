import { Injectable, Inject } from '@nestjs/common';
import type { GetAddressTopTransfersInput } from '../schemas/get-address-top-transfers.schema';
import type { GetAddressTopTransfersResult, WalletTransfer } from '../types';
import {
  ADDRESS_TRANSFERS_FETCHER,
  type IAddressTransfersFetcher,
} from '../ports/address-transfers-fetcher.port';
import {
  ADDRESS_TOP_TRANSFERS_TOP_N,
  RESOLVE_AND_ADDRESS_CHAINS,
} from '../constants/domain.constants';

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
export class GetAddressTopTransfersUseCase {
  constructor(
    @Inject(ADDRESS_TRANSFERS_FETCHER)
    private readonly addressTransfersFetcher: IAddressTransfersFetcher,
  ) {}

  async execute(
    input: GetAddressTopTransfersInput,
  ): Promise<GetAddressTopTransfersResult> {
    const { address } = input;
    const normalizedAddress = address.trim().toLowerCase();
    const result: Record<string, { transfers: WalletTransfer[] }> = {};

    for (const chain of RESOLVE_AND_ADDRESS_CHAINS) {
      const all: WalletTransfer[] =
        await this.addressTransfersFetcher.getAddressTransfers(
          chain,
          normalizedAddress,
        );
      const top = topOutboundByAmount(all, ADDRESS_TOP_TRANSFERS_TOP_N);
      if (top.length > 0) {
        result[chain] = { transfers: top };
      }
    }

    return result as GetAddressTopTransfersResult;
  }
}

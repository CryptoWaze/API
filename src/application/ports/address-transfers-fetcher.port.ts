import type { WalletTransfer } from '../types';

export const ADDRESS_TRANSFERS_FETCHER = Symbol('ADDRESS_TRANSFERS_FETCHER');

export type IAddressTransfersFetcher = {
  getAddressTransfers(
    chain: string,
    address: string,
  ): Promise<WalletTransfer[]>;
  getAddressTransfersPage(
    chain: string,
    address: string,
    page: number,
  ): Promise<WalletTransfer[]>;
};

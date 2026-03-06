import type { Transfer } from '../types';

export type TransactionWithTransfers = {
  fromAddress: string;
  toAddress: string;
  blockSignedAt: string;
  transfers: Transfer[];
};

export const TRANSACTION_FETCHER = Symbol('TRANSACTION_FETCHER');

export type ITransactionFetcher = {
  getTransactionWithTransfers(
    chain: string,
    txHash: string,
  ): Promise<TransactionWithTransfers | null>;
};

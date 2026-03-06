export type Transfer = {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;
  amount: number;
  timestamp: string;
  contract?: string;
};

export type ResolveTransactionResult = {
  chain: string;
  transaction: {
    fromAddress: string;
    toAddress: string;
    blockSignedAt: string;
  };
  transfers: Transfer[];
  seedTransfer: Transfer | null;
};

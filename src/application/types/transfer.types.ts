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

export type WalletTransfer = {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;
  amount: number;
  timestamp: string;
  txHash: string;
  contract?: string;
  direction: 'IN' | 'OUT';
  counterparty: string;
};

export type GetAddressTopTransfersResult = {
  [chain: string]: { transfers: WalletTransfer[] };
};

export type GetAddressTopTransfersPaginatedResult = {
  chain: string;
  page: number;
  transfers: WalletTransfer[];
};

export type GetAddressTopTransfersHistoryResult = {
  chain: string;
  transfers: WalletTransfer[];
};

export type FlowStep = {
  fromAddress: string;
  toAddress: string;
  transfer: WalletTransfer;
};

export type FollowFlowToExchangeResult = {
  chain: string;
  steps: FlowStep[];
  endpointAddress: string;
};

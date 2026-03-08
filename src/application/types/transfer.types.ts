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

export type FlowGraphNode = {
  id: string;
  label: string;
};

export type FlowGraphEdge = {
  from: string;
  to: string;
  symbol: string;
  amount: number;
  amountRaw: string;
  txHash: string;
  outcome?:
    | 'SUCCESS'
    | 'NO_OUTBOUND'
    | 'MAX_WALLETS_REACHED'
    | 'EXHAUSTED_OPTIONS';
};

export type FlowGraph = {
  nodes: FlowGraphNode[];
  edges: FlowGraphEdge[];
};

export type FollowFlowToExchangeFullHistorySuccess = {
  success: true;
  chain: string;
  steps: FlowStep[];
  endpointAddress: string;
  graph: FlowGraph;
};

export type FollowFlowToExchangeFullHistoryFailure = {
  success: false;
  chain: string;
  reason: string;
  lastWallet: string;
  steps: FlowStep[];
  graph: FlowGraph;
};

export type FollowFlowToExchangeFullHistoryResult =
  | FollowFlowToExchangeFullHistorySuccess
  | FollowFlowToExchangeFullHistoryFailure;

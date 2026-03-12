export type ReportSeedDto = {
  txHash: string;
  chainSlug: string;
  chainName: string | null;
  tokenSymbol: string | null;
  amountDecimal: string;
  timestamp: string;
  txExplorerUrl: string;
  initialWalletAddresses: string[];
};

export type ReportFlowStepDto = {
  fromAddress: string;
  toAddress: string;
  tokenSymbol: string | null;
  amountDecimal: string;
  txHash: string | null;
  timestamp: string | null;
  txExplorerUrl: string | null;
  fromExplorerUrl: string;
  toExplorerUrl: string;
};

export type ReportFlowDto = {
  chainSlug: string;
  chainName: string | null;
  initialWalletAddress: string;
  endpointAddress: string;
  endpointExchangeName: string | null;
  endpointLabel: string;
  steps: ReportFlowStepDto[];
};

export type ReportTemplateData = {
  caseName: string;
  generatedAt: string;
  totalAmountLostDecimal: string;
  seeds: ReportSeedDto[];
  flows: ReportFlowDto[];
  imagePlaceholder: string;
};

export const FLOW_TRACE_LOG_WRITER = Symbol('FLOW_TRACE_LOG_WRITER');

export type FlowTraceLogStepInput = {
  fromAddress: string;
  toAddress: string;
  transferSymbol: string;
  transferAmountRaw: string;
  transferAmountDecimal: number;
  txHash: string;
};

export type FlowTraceLogInput = {
  inputAddress: string;
  chainSlug: string;
  status:
    | 'SUCCESS'
    | 'NO_OUTBOUND'
    | 'MAX_WALLETS_REACHED'
    | 'EXHAUSTED_OPTIONS';
  endpointAddress?: string;
  failureAtAddress?: string;
  failureReason?: string;
  steps: FlowTraceLogStepInput[];
};

export type IFlowTraceLogWriter = {
  write(input: FlowTraceLogInput): Promise<void>;
};

export const FLOW_TRACE_PROGRESS_EMITTER = Symbol(
  'FLOW_TRACE_PROGRESS_EMITTER',
);

export type FlowTraceProgressPayload = {
  message: string;
  depth?: number;
  address?: string;
  stackLength?: number;
  stackRemaining?: number;
  count?: number;
  page?: number;
  totalTransfers?: number;
  nextAddress?: string;
  symbol?: string;
  amount?: number;
  reason?: string;
  lastWallet?: string;
};

export type IFlowTraceProgressEmitter = {
  emit(traceId: string, payload: FlowTraceProgressPayload): void;
};

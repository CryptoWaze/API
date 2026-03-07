import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { GetFlowToExchangeInput } from '../schemas/get-flow-to-exchange.schema';
import type {
  FollowFlowToExchangeResult,
  FlowStep,
  WalletTransfer,
} from '../types';
import {
  ADDRESS_TRANSFERS_FETCHER,
  type IAddressTransfersFetcher,
} from '../ports/address-transfers-fetcher.port';
import {
  HOT_WALLET_CHECKER,
  type IHotWalletChecker,
} from '../ports/hot-wallet-checker.port';
import {
  FLOW_TRACE_LOG_WRITER,
  type IFlowTraceLogWriter,
  type FlowTraceLogStepInput,
} from '../ports/flow-trace-log-writer.port';

const MAX_WALLETS = 50;
const MAX_PAGES_PER_WALLET = 50;
const TOP_OUTBOUNDS_PER_WALLET = 10;
const HOT_WALLET_SCAN_LIMIT = 100;

function toCovalentChainId(slug: string): string {
  return `${slug}-mainnet`;
}

function normalizeAddress(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

function pickTopOutbounds(
  transfers: WalletTransfer[],
  limit: number,
): WalletTransfer[] {
  const out = transfers.filter((t) => t.direction === 'OUT');
  if (out.length === 0) return [];
  const sorted = [...out].sort((a, b) =>
    Number(BigInt(b.rawAmount) - BigInt(a.rawAmount)),
  );
  return sorted.slice(0, limit);
}

type TraceSuccess = {
  success: true;
  chain: string;
  steps: FlowStep[];
  endpointAddress: string;
};

type TraceFailure = {
  success: false;
  reason: 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
  lastWallet: string;
  steps: FlowStep[];
};

type EdgeOutcome =
  | 'SUCCESS'
  | 'NO_OUTBOUND'
  | 'MAX_WALLETS_REACHED'
  | 'EXHAUSTED_OPTIONS';

type EdgeRecord = {
  fromAddress: string;
  toAddress: string;
  transfer: WalletTransfer;
  outcome: EdgeOutcome | null;
};

function edgesToLogInput(edges: EdgeRecord[]): FlowTraceLogStepInput[] {
  return edges.map((e) => ({
    fromAddress: e.fromAddress,
    toAddress: e.toAddress,
    transferSymbol: e.transfer.symbol,
    transferAmountRaw: e.transfer.rawAmount,
    transferAmountDecimal: e.transfer.amount,
    txHash: e.transfer.txHash,
    outcome: e.outcome ?? undefined,
  }));
}

function markPathEdgesSuccess(edges: EdgeRecord[], path: FlowStep[]): void {
  for (const step of path) {
    const edge = edges.find(
      (e) =>
        e.fromAddress === step.fromAddress && e.toAddress === step.toAddress,
    );
    if (edge && edge.outcome === null) edge.outcome = 'SUCCESS';
  }
}

function shortAddress(addr: string): string {
  const a = addr.trim();
  if (a.length <= 12) return a;
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

@Injectable()
export class FollowFlowToExchangeFullHistoryUseCase {
  private readonly logger = new Logger(
    FollowFlowToExchangeFullHistoryUseCase.name,
  );

  constructor(
    @Inject(ADDRESS_TRANSFERS_FETCHER)
    private readonly addressTransfersFetcher: IAddressTransfersFetcher,
    @Inject(HOT_WALLET_CHECKER)
    private readonly hotWalletChecker: IHotWalletChecker,
    @Inject(FLOW_TRACE_LOG_WRITER)
    private readonly flowTraceLogWriter: IFlowTraceLogWriter,
  ) {}

  async execute(
    input: GetFlowToExchangeInput,
  ): Promise<FollowFlowToExchangeResult> {
    const chainSlug = input.chain.trim();
    const covalentChainId = toCovalentChainId(chainSlug);
    const startAddress = normalizeAddress(input.address);

    this.logger.log(
      `Flow trace started chain=${chainSlug} start=${shortAddress(startAddress)}`,
    );

    try {
      const { result, edges } = await this.traceFlowIterative(
        covalentChainId,
        chainSlug,
        startAddress,
      );

      const logSteps = edgesToLogInput(edges);
      if (result.success) {
        await this.flowTraceLogWriter.write({
          inputAddress: startAddress,
          chainSlug,
          status: 'SUCCESS',
          endpointAddress: result.endpointAddress,
          steps: logSteps,
        });
        return {
          chain: result.chain,
          steps: result.steps,
          endpointAddress: result.endpointAddress,
        };
      }

      const failureReason =
        result.reason === 'NO_OUTBOUND'
          ? 'Carteira sem transferências de saída no histórico'
          : result.reason === 'MAX_WALLETS_REACHED'
            ? 'Limite de 50 carteiras atingido sem encontrar hot wallet'
            : 'Todas as ramificações tentadas sem encontrar hot wallet';
      await this.flowTraceLogWriter.write({
        inputAddress: startAddress,
        chainSlug,
        status: result.reason,
        failureAtAddress: result.lastWallet,
        failureReason,
        steps: logSteps,
      });
      throw new NotFoundException(
        `Nenhum fluxo até exchange encontrado (máx. ${MAX_WALLETS} carteiras).`,
      );
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      this.logger.error(
        `followFlowToExchangeFullHistory failed: ${message}`,
        stack,
      );
      if (/Covalent API error: (500|502|503)/.test(message)) {
        throw new BadGatewayException(
          'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao rastrear fluxo até exchange.',
      );
    }
  }

  private async getFullHistoryTopOutbounds(
    covalentChainId: string,
    address: string,
    limit: number,
  ): Promise<WalletTransfer[]> {
    const all: WalletTransfer[] = [];
    const PAGE_LOG_INTERVAL = 20;
    for (let page = 0; page < MAX_PAGES_PER_WALLET; page++) {
      const pageTransfers: WalletTransfer[] =
        await this.addressTransfersFetcher.getAddressTransfersPage(
          covalentChainId,
          address,
          page,
        );
      if (pageTransfers.length === 0) break;
      all.push(...pageTransfers);
      if (page > 0 && page % PAGE_LOG_INTERVAL === 0) {
        this.logger.log(
          `Fetching outbounds addr=${shortAddress(address)} page=${page} totalTransfers=${all.length}`,
        );
      }
    }
    return pickTopOutbounds(all, limit);
  }

  private visitedAddresses(
    path: FlowStep[],
    startAddress: string,
  ): Set<string> {
    const set = new Set<string>([normalizeAddress(startAddress)]);
    for (const step of path) {
      set.add(normalizeAddress(step.fromAddress));
      set.add(normalizeAddress(step.toAddress));
    }
    return set;
  }

  private async traceFlowIterative(
    covalentChainId: string,
    chainSlug: string,
    startAddress: string,
  ): Promise<{
    result: TraceSuccess | TraceFailure;
    edges: EdgeRecord[];
  }> {
    type StackFrame = {
      path: FlowStep[];
      currentAddress: string;
      outbounds: WalletTransfer[] | null;
      outboundIndex: number;
      edgeIndex?: number;
    };

    const edges: EdgeRecord[] = [];
    const stack: StackFrame[] = [
      {
        path: [],
        currentAddress: startAddress,
        outbounds: null,
        outboundIndex: 0,
      },
    ];

    let lastFailure: {
      path: FlowStep[];
      lastWallet: string;
      reason: TraceFailure['reason'];
    } | null = null;

    let lastHeartbeatAt = Date.now();
    const HEARTBEAT_INTERVAL_MS = 30_000;

    while (stack.length > 0) {
      if (Date.now() - lastHeartbeatAt >= HEARTBEAT_INTERVAL_MS) {
        const top = stack[stack.length - 1];
        this.logger.log(
          `Flow trace in progress stack=${stack.length} depth=${top.path.length} current=${shortAddress(top.currentAddress)}`,
        );
        lastHeartbeatAt = Date.now();
      }

      const frame = stack.pop()!;
      const depth = frame.path.length;
      const stackRemaining = stack.length;

      this.logger.log(
        `Processing depth=${depth} stackRemaining=${stackRemaining} addr=${shortAddress(frame.currentAddress)}`,
      );

      if (frame.path.length >= MAX_WALLETS) {
        this.logger.log(
          `MAX_WALLETS_REACHED depth=${depth} addr=${shortAddress(frame.currentAddress)}`,
        );
        if (frame.edgeIndex !== undefined) {
          edges[frame.edgeIndex].outcome = 'MAX_WALLETS_REACHED';
        }
        lastFailure = {
          path: frame.path,
          lastWallet: frame.currentAddress,
          reason: 'MAX_WALLETS_REACHED',
        };
        continue;
      }

      const isHot = await this.hotWalletChecker.isHotWallet(
        chainSlug,
        frame.currentAddress,
      );
      if (isHot) {
        this.logger.log(
          `HOT WALLET FOUND depth=${depth} endpoint=${shortAddress(frame.currentAddress)}`,
        );
        markPathEdgesSuccess(edges, frame.path);
        return {
          result: {
            success: true,
            chain: chainSlug,
            steps: frame.path,
            endpointAddress: frame.currentAddress,
          },
          edges,
        };
      }

      if (frame.outbounds === null) {
        this.logger.log(
          `Fetching outbounds depth=${depth} addr=${shortAddress(frame.currentAddress)}`,
        );
        frame.outbounds = await this.getFullHistoryTopOutbounds(
          covalentChainId,
          frame.currentAddress,
          HOT_WALLET_SCAN_LIMIT,
        );
        this.logger.log(
          `Outbounds received depth=${depth} count=${frame.outbounds.length}`,
        );
      }
      if (frame.outbounds.length === 0) {
        this.logger.log(
          `NO_OUTBOUND depth=${depth} addr=${shortAddress(frame.currentAddress)} (backtracking)`,
        );
        if (frame.edgeIndex !== undefined) {
          edges[frame.edgeIndex].outcome = 'NO_OUTBOUND';
        }
        lastFailure = {
          path: frame.path,
          lastWallet: frame.currentAddress,
          reason: 'NO_OUTBOUND',
        };
        continue;
      }

      for (const transfer of frame.outbounds) {
        const counterparty = normalizeAddress(transfer.counterparty);
        const isCounterpartyHot = await this.hotWalletChecker.isHotWallet(
          chainSlug,
          counterparty,
        );
        if (isCounterpartyHot) {
          const step: FlowStep = {
            fromAddress: frame.currentAddress,
            toAddress: counterparty,
            transfer,
          };
          edges.push({
            fromAddress: frame.currentAddress,
            toAddress: counterparty,
            transfer,
            outcome: 'SUCCESS',
          });
          markPathEdgesSuccess(edges, frame.path);
          this.logger.log(
            `HOT WALLET FOUND IN HISTORY depth=${depth} endpoint=${shortAddress(counterparty)} (from outbound scan)`,
          );
          return {
            result: {
              success: true,
              chain: chainSlug,
              steps: frame.path.concat(step),
              endpointAddress: counterparty,
            },
            edges,
          };
        }
      }

      frame.outbounds = frame.outbounds.slice(0, TOP_OUTBOUNDS_PER_WALLET);

      const visited = this.visitedAddresses(frame.path, startAddress);
      let pushed = false;
      while (frame.outboundIndex < frame.outbounds.length) {
        const transfer = frame.outbounds[frame.outboundIndex];
        frame.outboundIndex++;
        const nextAddress = normalizeAddress(transfer.counterparty);
        if (visited.has(nextAddress)) continue;

        const newStep: FlowStep = {
          fromAddress: frame.currentAddress,
          toAddress: nextAddress,
          transfer,
        };
        const newPath = frame.path.concat(newStep);
        edges.push({
          fromAddress: frame.currentAddress,
          toAddress: nextAddress,
          transfer,
          outcome: null,
        });
        const edgeIndex = edges.length - 1;
        this.logger.log(
          `Forward depth=${depth} -> ${newPath.length} next=${shortAddress(nextAddress)} ${transfer.symbol} ${transfer.amount}`,
        );
        stack.push({
          path: frame.path,
          currentAddress: frame.currentAddress,
          outbounds: frame.outbounds,
          outboundIndex: frame.outboundIndex,
        });
        stack.push({
          path: newPath,
          currentAddress: nextAddress,
          outbounds: null,
          outboundIndex: 0,
          edgeIndex,
        });
        pushed = true;
        break;
      }
      if (!pushed) {
        this.logger.log(
          `EXHAUSTED_OPTIONS depth=${depth} addr=${shortAddress(frame.currentAddress)} (backtracking)`,
        );
        if (frame.edgeIndex !== undefined) {
          edges[frame.edgeIndex].outcome = 'EXHAUSTED_OPTIONS';
        }
        lastFailure = {
          path: frame.path,
          lastWallet: frame.currentAddress,
          reason: 'EXHAUSTED_OPTIONS',
        };
      }
    }

    this.logger.log(
      `Flow trace finished no hot wallet lastWallet=${shortAddress(lastFailure?.lastWallet ?? startAddress)} reason=${lastFailure?.reason ?? 'EXHAUSTED_OPTIONS'}`,
    );

    const path = lastFailure?.path ?? [];
    const lastWallet = lastFailure?.lastWallet ?? startAddress;
    const reason = lastFailure?.reason ?? 'EXHAUSTED_OPTIONS';
    return {
      result: {
        success: false,
        reason,
        lastWallet,
        steps: path,
      },
      edges,
    };
  }
}

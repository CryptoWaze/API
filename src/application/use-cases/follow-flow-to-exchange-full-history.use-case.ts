import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  Optional,
} from '@nestjs/common';
import type { GetFlowToExchangeInput } from '../schemas/get-flow-to-exchange.schema';
import type {
  FollowFlowToExchangeFullHistoryResult,
  FlowGraph,
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
import {
  FLOW_TRACE_PROGRESS_EMITTER,
  type IFlowTraceProgressEmitter,
  type FlowTraceProgressPayload,
} from '../ports/flow-trace-progress-emitter.port';

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

function friendlyReason(reason: string): string {
  switch (reason) {
    case 'NO_OUTBOUND':
      return 'Carteira sem transferências de saída no histórico';
    case 'MAX_WALLETS_REACHED':
      return 'Limite máximo de carteiras analisadas (50)';
    case 'EXHAUSTED_OPTIONS':
      return 'Todos os caminhos desta ramificação já foram tentados';
    default:
      return reason;
  }
}

function buildGraph(edges: EdgeRecord[]): FlowGraph {
  const nodeIds = new Set<string>();
  for (const e of edges) {
    nodeIds.add(e.fromAddress);
    nodeIds.add(e.toAddress);
  }
  const nodes = Array.from(nodeIds).map((id) => ({
    id,
    label: id,
  }));
  const graphEdges = edges.map((e) => ({
    from: e.fromAddress,
    to: e.toAddress,
    symbol: e.transfer.symbol,
    amount: e.transfer.amount,
    amountRaw: e.transfer.rawAmount,
    txHash: e.transfer.txHash,
    outcome: e.outcome ?? undefined,
  }));
  return { nodes, edges: graphEdges };
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
    @Optional()
    @Inject(FLOW_TRACE_PROGRESS_EMITTER)
    private readonly flowTraceProgressEmitter: IFlowTraceProgressEmitter | null,
  ) {}

  private progress(
    traceId: string | undefined,
    payload: FlowTraceProgressPayload,
  ): void {
    this.logger.log(payload.message);
    if (traceId && this.flowTraceProgressEmitter) {
      this.flowTraceProgressEmitter.emit(traceId, payload);
    }
  }

  async execute(
    input: GetFlowToExchangeInput,
  ): Promise<FollowFlowToExchangeFullHistoryResult> {
    const chainSlug = input.chain.trim();
    const covalentChainId = toCovalentChainId(chainSlug);
    const startAddress = normalizeAddress(input.address);
    const traceId = input.traceId;

    this.progress(traceId, {
      message: `Iniciando rastreio do fluxo na rede ${chainSlug}. Carteira de partida: ${startAddress}`,
      address: startAddress,
    });

    try {
      const { result, edges } = await this.traceFlowIterative(
        covalentChainId,
        chainSlug,
        startAddress,
        traceId,
      );

      const logSteps = edgesToLogInput(edges);
      const graph = buildGraph(edges);
      if (result.success) {
        await this.flowTraceLogWriter.write({
          inputAddress: startAddress,
          chainSlug,
          status: 'SUCCESS',
          endpointAddress: result.endpointAddress,
          steps: logSteps,
        });
        return {
          success: true,
          chain: result.chain,
          steps: result.steps,
          endpointAddress: result.endpointAddress,
          graph,
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
      return {
        success: false,
        chain: chainSlug,
        reason: result.reason,
        lastWallet: result.lastWallet,
        steps: result.steps,
        graph,
      };
    } catch (err) {
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
    traceId: string | undefined,
  ): Promise<WalletTransfer[]> {
    const all: WalletTransfer[] = [];
    const PAGE_LOG_INTERVAL = 20;
    for (let page = 0; page < MAX_PAGES_PER_WALLET; page++) {
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      const pageTransfers =
        (await this.addressTransfersFetcher.getAddressTransfersPage(
          covalentChainId,
          address,
          page,
        )) as WalletTransfer[];
      /* eslint-enable @typescript-eslint/no-unsafe-call */
      if (pageTransfers.length === 0) break;
      all.push(...pageTransfers);
      if (page > 0 && page % PAGE_LOG_INTERVAL === 0) {
        this.progress(traceId, {
          message: `Buscando histórico de transferências da carteira... (página ${page + 1}, ${all.length} transferências encontradas até agora)`,
          address: normalizeAddress(address),
          page: page + 1,
          totalTransfers: all.length,
        });
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
    traceId: string | undefined,
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
        this.progress(traceId, {
          message: `Rastreio em andamento. Analisando carteira na etapa ${top.path.length + 1}.`,
          stackLength: stack.length,
          depth: top.path.length,
          address: top.currentAddress,
        });
        lastHeartbeatAt = Date.now();
      }

      const frame = stack.pop()!;
      const depth = frame.path.length;
      const stackRemaining = stack.length;

      this.progress(traceId, {
        message: `Analisando carteira na etapa ${depth + 1}...`,
        depth: depth + 1,
        stackRemaining,
        address: frame.currentAddress,
      });

      if (frame.path.length >= MAX_WALLETS) {
        this.progress(traceId, {
          message: `Limite máximo de carteiras analisadas atingido (50). Interrompendo rastreio.`,
          depth: depth + 1,
          address: frame.currentAddress,
        });
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
        this.progress(traceId, {
          message: `Exchange encontrada. Carteira de destino identificada.`,
          depth: depth + 1,
          address: frame.currentAddress,
        });
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
        this.progress(traceId, {
          message: `Buscando todas as transferências de saída desta carteira...`,
          depth: depth + 1,
          address: frame.currentAddress,
        });
        frame.outbounds = await this.getFullHistoryTopOutbounds(
          covalentChainId,
          frame.currentAddress,
          HOT_WALLET_SCAN_LIMIT,
          traceId,
        );
        this.progress(traceId, {
          message: `Foram encontradas ${frame.outbounds.length} transferências de saída. Verificando destinos...`,
          depth: depth + 1,
          count: frame.outbounds.length,
          address: frame.currentAddress,
        });
      }
      if (frame.outbounds.length === 0) {
        this.progress(traceId, {
          message: `Esta carteira não possui transferências de saída no histórico. Voltando para tentar outro caminho.`,
          depth: depth + 1,
          address: frame.currentAddress,
        });
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
          this.progress(traceId, {
            message: `Exchange encontrada. Uma das transferências desta carteira vai direto para uma exchange cadastrada.`,
            depth: depth + 1,
            address: counterparty,
          });
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
        this.progress(traceId, {
          message: `Seguindo transferência de ${transfer.amount} ${transfer.symbol} para a próxima carteira...`,
          depth: depth + 1,
          nextAddress,
          symbol: transfer.symbol,
          amount: transfer.amount,
        });
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
        this.progress(traceId, {
          message: `Todos os caminhos possíveis a partir desta carteira já foram tentados. Voltando para tentar outra ramificação.`,
          depth: depth + 1,
          address: frame.currentAddress,
        });
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

    const lastWalletFull = lastFailure?.lastWallet ?? startAddress;
    const reasonCode = lastFailure?.reason ?? 'EXHAUSTED_OPTIONS';
    this.progress(traceId, {
      message: `Rastreio finalizado. Nenhuma exchange foi encontrada no caminho. Última carteira analisada: ${lastWalletFull}. Motivo: ${friendlyReason(reasonCode)}.`,
      lastWallet: lastWalletFull,
      reason: friendlyReason(reasonCode),
    });

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

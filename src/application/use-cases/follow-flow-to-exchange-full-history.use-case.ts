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
import {
  TOKEN_PRICE_PROVIDER,
  type ITokenPriceProvider,
  type TokenInfo,
} from '../ports/token-price-provider.port';

const MAX_WALLETS = 50;
const MAX_PAGES_PER_WALLET = 50;
const TOP_OUTBOUNDS_PER_WALLET = 10;
const HOT_WALLET_SCAN_LIMIT = 100;
const MIN_TRANSFER_AMOUNT = 0.01;

function toCovalentChainId(slug: string): string {
  return `${slug}-mainnet`;
}

function normalizeAddress(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

function filterOutboundsAboveMin(
  transfers: WalletTransfer[],
): WalletTransfer[] {
  return transfers.filter(
    (t) => t.direction === 'OUT' && t.amount >= MIN_TRANSFER_AMOUNT,
  );
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
    timestamp: e.transfer.timestamp,
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
    @Inject(TOKEN_PRICE_PROVIDER)
    private readonly tokenPriceProvider: ITokenPriceProvider,
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

    const rawMin = (input as { minTimestamp?: string }).minTimestamp;
    const minTimestamp: string | undefined =
      typeof rawMin === 'string' && rawMin ? rawMin.trim() : undefined;

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
        minTimestamp,
      );

      const logSteps = edgesToLogInput(edges);
      const graph = buildGraph(edges);
      const tokenInfoBySymbol: Map<string, TokenInfo> =
        await this.enrichTokenInfo(result.steps, graph.edges);
      const enrichedSteps = result.steps.map((s) => {
        const info = tokenInfoBySymbol.get(
          s.transfer.symbol.trim().toLowerCase(),
        );
        return {
          ...s,
          tokenPriceUsd: info?.priceUsd ?? null,
          tokenImageUrl: info?.imageUrl ?? null,
        };
      });
      const enrichedEdges = graph.edges.map((e) => {
        const info = tokenInfoBySymbol.get(e.symbol.trim().toLowerCase());
        return {
          ...e,
          tokenPriceUsd: info?.priceUsd ?? null,
          tokenImageUrl: info?.imageUrl ?? null,
        };
      });

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
          steps: enrichedSteps,
          endpointAddress: result.endpointAddress,
          graph: { nodes: graph.nodes, edges: enrichedEdges },
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
        steps: enrichedSteps,
        graph: { nodes: graph.nodes, edges: enrichedEdges },
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

  private parseTimestampToMs(ts: string): number | null {
    if (!ts || typeof ts !== 'string') return null;
    const ms = new Date(ts.trim()).getTime();
    return Number.isNaN(ms) ? null : ms;
  }

  private async getFullHistoryTopOutbounds(
    covalentChainId: string,
    address: string,
    limit: number,
    traceId: string | undefined,
    minTimestamp: string | undefined,
  ): Promise<WalletTransfer[]> {
    const all: WalletTransfer[] = [];
    const minTimeMs =
      minTimestamp != null ? this.parseTimestampToMs(minTimestamp) : null;
    const PAGE_LOG_INTERVAL = 20;

    for (let page = 0; page < MAX_PAGES_PER_WALLET; page++) {
      const pageTransfers =
        await this.addressTransfersFetcher.getAddressTransfersPage(
          covalentChainId,
          address,
          page,
        );
      if (pageTransfers.length === 0) break;

      for (const t of pageTransfers) {
        if (minTimeMs != null) {
          const tMs = this.parseTimestampToMs(t.timestamp);
          if (tMs == null || tMs < minTimeMs) continue;
        }
        all.push(t);
      }

      if (page > 0 && page % PAGE_LOG_INTERVAL === 0) {
        this.progress(traceId, {
          message: `Buscando histórico de transferências da carteira... (página ${page + 1}, ${all.length} transferências encontradas até agora)`,
          address: normalizeAddress(address),
          page: page + 1,
          totalTransfers: all.length,
        });
      }
    }
    return this.pickTopOutboundsByUsd(all, limit);
  }

  async getTopOutboundsForWallet(input: {
    chain: string;
    address: string;
    limit: number;
    traceId?: string;
    minTimestamp?: string;
  }): Promise<WalletTransfer[]> {
    const chainSlug = input.chain.trim();
    const covalentChainId = toCovalentChainId(chainSlug);
    const address = normalizeAddress(input.address);
    const limit = input.limit;
    const traceId = input.traceId;
    const minTimestamp =
      typeof input.minTimestamp === 'string' && input.minTimestamp
        ? input.minTimestamp.trim()
        : undefined;
    return this.getFullHistoryTopOutbounds(
      covalentChainId,
      address,
      limit,
      traceId,
      minTimestamp,
    );
  }

  private async enrichTokenInfo(
    steps: FlowStep[],
    edges: { symbol: string }[],
  ): Promise<Map<string, TokenInfo>> {
    const symbols = new Set<string>();
    for (const s of steps) {
      symbols.add(s.transfer.symbol.trim().toLowerCase());
    }
    for (const e of edges) {
      symbols.add(e.symbol.trim().toLowerCase());
    }
    return this.tokenPriceProvider.getTokenInfoBatch([...symbols]);
  }

  private async pickTopOutboundsByUsd(
    transfers: WalletTransfer[],
    limit: number,
  ): Promise<WalletTransfer[]> {
    const out = filterOutboundsAboveMin(transfers);
    if (out.length === 0) return [];
    const symbols = [...new Set(out.map((t) => t.symbol.trim().toLowerCase()))];
    const priceBySymbol = new Map<string, number>();
    for (const symbol of symbols) {
      const price = await this.tokenPriceProvider.getPriceInUsd(symbol);
      priceBySymbol.set(symbol, price ?? 0);
    }
    const withUsd = out.map((t) => {
      const price = priceBySymbol.get(t.symbol.trim().toLowerCase()) ?? 0;
      const valueUsd = t.amount * price;
      return { transfer: t, valueUsd };
    });
    withUsd.sort((a, b) => b.valueUsd - a.valueUsd);
    return withUsd.slice(0, limit).map((x) => x.transfer);
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
    minTimestamp: string | undefined,
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
          minTimestamp,
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
          const allToHot = frame.outbounds.filter(
            (t) => normalizeAddress(t.counterparty) === counterparty,
          );
          allToHot.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
          const stepsToHot: FlowStep[] = allToHot.map((t) => ({
            fromAddress: frame.currentAddress,
            toAddress: counterparty,
            transfer: t,
          }));
          for (const t of allToHot) {
            edges.push({
              fromAddress: frame.currentAddress,
              toAddress: counterparty,
              transfer: t,
              outcome: 'SUCCESS',
            });
          }
          markPathEdgesSuccess(edges, frame.path);
          this.progress(traceId, {
            message: `Exchange encontrada. ${allToHot.length} transferência(s) desta carteira para exchange cadastrada.`,
            depth: depth + 1,
            address: counterparty,
          });
          return {
            result: {
              success: true,
              chain: chainSlug,
              steps: frame.path.concat(stepsToHot),
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
        const nextAddress = normalizeAddress(transfer.counterparty);
        if (visited.has(nextAddress)) {
          frame.outboundIndex++;
          continue;
        }
        let maxIdx = frame.outboundIndex;
        const allToB: WalletTransfer[] = [];
        for (let i = frame.outboundIndex; i < frame.outbounds.length; i++) {
          if (
            normalizeAddress(frame.outbounds[i].counterparty) === nextAddress
          ) {
            allToB.push(frame.outbounds[i]);
            maxIdx = i;
          }
        }
        allToB.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
        const stepsToB: FlowStep[] = allToB.map((t) => ({
          fromAddress: frame.currentAddress,
          toAddress: nextAddress,
          transfer: t,
        }));
        const newPath = frame.path.concat(stepsToB);
        for (const t of allToB) {
          edges.push({
            fromAddress: frame.currentAddress,
            toAddress: nextAddress,
            transfer: t,
            outcome: null,
          });
        }
        const edgeIndex = edges.length - 1;
        const totalAmount = allToB.reduce((sum, t) => sum + t.amount, 0);
        const symbol = allToB[0]?.symbol ?? transfer.symbol;
        this.progress(traceId, {
          message:
            allToB.length > 1
              ? `Seguindo ${allToB.length} transferências (total ${totalAmount} ${symbol}) para a próxima carteira...`
              : `Seguindo transferência de ${transfer.amount} ${transfer.symbol} para a próxima carteira...`,
          depth: depth + 1,
          nextAddress,
          symbol,
          amount: totalAmount,
        });
        const nextOutboundIndex = maxIdx + 1;
        stack.push({
          path: frame.path,
          currentAddress: frame.currentAddress,
          outbounds: frame.outbounds,
          outboundIndex: nextOutboundIndex,
        });
        stack.push({
          path: newPath,
          currentAddress: nextAddress,
          outbounds: null,
          outboundIndex: 0,
          edgeIndex,
        });
        frame.outboundIndex = nextOutboundIndex;
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

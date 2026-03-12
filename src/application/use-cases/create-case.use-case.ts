import { randomUUID } from 'node:crypto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCaseInput } from '../schemas/create-case.schema';
import type {
  FollowFlowToExchangeFullHistoryResult,
  FlowGraphEdge,
  FlowStep,
  ResolveTransactionResult,
  WalletTransfer,
} from '../types';
import { ResolveTransactionUseCase } from './resolve-transaction.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from './follow-flow-to-exchange-full-history.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CaseStatus, FlowEndpointReason } from '../../generated/prisma';
import { SocketGateway } from '../../presentation/socket/socket.gateway';
import {
  TOKEN_PRICE_PROVIDER,
  type ITokenPriceProvider,
} from '../ports/token-price-provider.port';

function chainToSlug(chain: string): string {
  const t = chain.trim();
  if (t.endsWith('-mainnet')) return t.slice(0, -'-mainnet'.length);
  return t;
}

function normalizeAddress(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

function mapToEndpointReason(
  result: FollowFlowToExchangeFullHistoryResult,
): FlowEndpointReason {
  if (result.success) return FlowEndpointReason.EXCHANGE_HOT_WALLET;
  const r = result.reason;
  if (r === 'MAX_WALLETS_REACHED') return FlowEndpointReason.MAX_HOPS_REACHED;
  if (r === 'NO_OUTBOUND') return FlowEndpointReason.NO_OUTBOUND;
  if (r === 'EXHAUSTED_OPTIONS') return FlowEndpointReason.EXHAUSTED_OPTIONS;
  return FlowEndpointReason.NO_OUTGOING_ABOVE_THRESHOLD;
}

function parseTimestamp(ts: string): Date {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

export type CreateCaseAccepted = {
  traceId: string;
  caseId: string;
  seedsCount: number;
};

const CASE_CREATED_EVENT = 'case-created';

type ResolvedFlow = {
  seedIndex: number;
  resolveResult: ResolveTransactionResult;
  flowResult: FollowFlowToExchangeFullHistoryResult;
};

@Injectable()
export class CreateCaseUseCase {
  constructor(
    private readonly resolveTransactionUseCase: ResolveTransactionUseCase,
    private readonly followFlowToExchangeFullHistoryUseCase: FollowFlowToExchangeFullHistoryUseCase,
    private readonly prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
    @Inject(TOKEN_PRICE_PROVIDER)
    private readonly tokenPriceProvider: ITokenPriceProvider,
  ) {}

  private async enrichPrefixTokenInfo(
    steps: FlowStep[],
    edges: FlowGraphEdge[],
  ): Promise<{
    steps: FlowStep[];
    edges: FlowGraphEdge[];
  }> {
    const symbols = new Set<string>();
    for (const s of steps) symbols.add(s.transfer.symbol.trim().toLowerCase());
    for (const e of edges) {
      if (e.symbol) symbols.add(e.symbol.trim().toLowerCase());
    }
    const map = await this.tokenPriceProvider.getTokenInfoBatch([...symbols]);
    const enrichedSteps = steps.map((s) => {
      const info = map.get(s.transfer.symbol.trim().toLowerCase());
      return {
        ...s,
        tokenPriceUsd: info?.priceUsd ?? null,
        tokenImageUrl: info?.imageUrl ?? null,
      };
    });
    const enrichedEdges = edges.map((e) => {
      const sym = e.symbol?.trim().toLowerCase();
      const info = sym ? map.get(sym) : null;
      return {
        ...e,
        tokenPriceUsd: info?.priceUsd ?? null,
        tokenImageUrl: info?.imageUrl ?? null,
      };
    });
    return { steps: enrichedSteps, edges: enrichedEdges };
  }

  private buildPrefixSteps(
    fromAddress: string,
    toAddress: string,
    outbounds: WalletTransfer[],
  ): { steps: FlowStep[]; edges: FlowGraphEdge[] } {
    const from = normalizeAddress(fromAddress);
    const to = normalizeAddress(toAddress);
    const allTo = outbounds
      .filter((t) => normalizeAddress(t.counterparty) === to)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    const steps: FlowStep[] = allTo.map((t) => ({
      fromAddress: from,
      toAddress: to,
      transfer: t,
    }));
    const edges: FlowGraphEdge[] = allTo.map((t) => ({
      from,
      to,
      symbol: t.symbol,
      amount: t.amount,
      amountRaw: t.rawAmount,
      txHash: t.txHash,
      outcome: 'SUCCESS',
      timestamp: t.timestamp,
      tokenPriceUsd: null,
      tokenImageUrl: null,
    }));
    return { steps, edges };
  }

  async execute(
    input: CreateCaseInput,
    createdByUserId: string,
  ): Promise<CreateCaseAccepted> {
    const { name, seeds } = input;
    const traceId = randomUUID();
    const totalAmountLostDecimal = seeds
      .reduce((s, seed) => s + seed.reportedLossAmount, 0)
      .toString();

    const caseRecord = await this.prisma.case.create({
      data: {
        name,
        createdByUserId,
        status: CaseStatus.PROCESSING,
        totalAmountLostRaw: '0',
        totalAmountLostDecimal,
      },
    });

    const mode = input.mode ?? 'advanced';
    void this.runInBackground(input, caseRecord.id, traceId, mode);

    return {
      traceId,
      caseId: caseRecord.id,
      seedsCount: seeds.length,
    };
  }

  private async runInBackground(
    input: CreateCaseInput,
    caseId: string,
    traceId: string,
    mode: 'basic' | 'advanced',
  ): Promise<void> {
    const { name, seeds } = input;
    let flowsCount = 0;
    try {
      const resolveResults = await Promise.all(
        seeds.map((seed) =>
          this.resolveTransactionUseCase
            .execute({
              txHash: seed.txHash,
              reportedLossAmount: seed.reportedLossAmount,
            })
            .then((r) => ({ ok: true as const, result: r }))
            .catch((err) => {
              if (err instanceof NotFoundException)
                return { ok: false as const, txHash: seed.txHash };
              throw err;
            }),
        ),
      );

      const firstResolved = resolveResults.find((r) => r.ok);
      const totalAmountLostRaw =
        firstResolved?.ok && firstResolved.result.seedTransfer
          ? firstResolved.result.seedTransfer.rawAmount
          : '0';
      if (totalAmountLostRaw !== '0') {
        await this.prisma.case.update({
          where: { id: caseId },
          data: { totalAmountLostRaw },
        });
      }

      const resolvedIndices = resolveResults
        .map((r, i) => (r.ok && r.result.seedTransfer ? i : -1))
        .filter((i) => i >= 0);

      const flowResults: ResolvedFlow[] = await Promise.all(
        resolvedIndices.map(async (seedIndex) => {
        const res = resolveResults[seedIndex];
        if (!res.ok || !res.result.seedTransfer) throw new Error('unreachable');
        const chainSlug = chainToSlug(res.result.chain);
        const startAddress = res.result.seedTransfer.to.trim().toLowerCase();
        const flowResult =
          await this.followFlowToExchangeFullHistoryUseCase.execute({
            address: startAddress,
            chain: chainSlug,
            traceId: `${traceId}-${seedIndex}`,
            minTimestamp: res.result.seedTransfer.timestamp ?? undefined,
          });
          return {
            seedIndex,
            resolveResult: res.result,
            flowResult,
          };
        }),
      );

      const chainBySlug = new Map<string, string>();
      const getChainId = async (slug: string): Promise<string> => {
        let id = chainBySlug.get(slug);
        if (!id) {
          const c = await this.prisma.chain.findUnique({
            where: { slug },
            select: { id: true },
          });
          if (!c) throw new Error(`Chain not found: ${slug}`);
          id = c.id;
          chainBySlug.set(slug, id);
        }
        return id;
      };

      for (const { seedIndex, resolveResult, flowResult } of flowResults) {
        const seedTransfer = resolveResult.seedTransfer;
        if (!seedTransfer) continue;

        const chainSlug = chainToSlug(resolveResult.chain);
        const chainId = await getChainId(chainSlug);
        const txHash = input.seeds[seedIndex].txHash;
        const minTimestamp = seedTransfer.timestamp ?? undefined;

        const seedRecord = await this.prisma.caseSeedTransaction.create({
          data: {
            caseId,
            chainId,
            txHash,
            tokenAddress: seedTransfer.contract ?? null,
            tokenSymbol: seedTransfer.symbol,
            amountRaw: seedTransfer.rawAmount,
            amountDecimal: seedTransfer.amount.toString(),
            timestamp: parseTimestamp(seedTransfer.timestamp),
          },
        });

        const BRANCH_CANDIDATES_PER_WALLET = 1;
        const OUTBOUNDS_LIMIT = 100;
        const MAX_BRANCH_HOPS = 20;

        let flowResultsForSeed: FollowFlowToExchangeFullHistoryResult[] = [
          flowResult,
        ];

        if (mode === 'advanced' && flowResult.success) {
          const extraFlowResults: FollowFlowToExchangeFullHistoryResult[] = [];

          const mainPathAddresses = new Set<string>();
          if (flowResult.steps.length > 0) {
            mainPathAddresses.add(
              normalizeAddress(flowResult.steps[0].fromAddress),
            );
            for (const s of flowResult.steps) {
              mainPathAddresses.add(normalizeAddress(s.toAddress));
            }
          }

          const extraCreatedByFrom = new Set<string>();

          for (let hop = 0; hop < flowResult.steps.length; hop++) {
            const step = flowResult.steps[hop];
            const from = normalizeAddress(step.fromAddress);
            const usedTo = normalizeAddress(step.toAddress);

            if (extraCreatedByFrom.has(from)) continue;

            const outbounds =
              await this.followFlowToExchangeFullHistoryUseCase.getTopOutboundsForWallet(
                {
                  chain: chainSlug,
                  address: from,
                  limit: OUTBOUNDS_LIMIT,
                  traceId: `${traceId}-${seedIndex}-branch-${hop}`,
                  minTimestamp,
                },
              );

            const picked: string[] = [];
            for (const t of outbounds) {
              const nextTo = normalizeAddress(t.counterparty);
              if (nextTo === usedTo) continue;
              if (picked.includes(nextTo)) continue;
              picked.push(nextTo);
              if (picked.length >= BRANCH_CANDIDATES_PER_WALLET) break;
            }

            for (let i = 0; i < picked.length; i++) {
              const nextTo = picked[i];
              const prefix = this.buildPrefixSteps(from, nextTo, outbounds);
              const enrichedPrefix = await this.enrichPrefixTokenInfo(
                prefix.steps,
                prefix.edges,
              );

              const remainingSlots =
                MAX_BRANCH_HOPS - enrichedPrefix.steps.length;
              if (remainingSlots <= 0) continue;

              const branchTrace =
                await this.followFlowToExchangeFullHistoryUseCase.execute({
                  address: nextTo,
                  chain: chainSlug,
                  traceId: `${traceId}-${seedIndex}-branch-${hop}-${i}`,
                  minTimestamp,
                });

              const maxBranchStepsCount = Math.max(0, remainingSlots);
              const trimmedBranchSteps =
                branchTrace.steps.length > maxBranchStepsCount
                  ? branchTrace.steps.slice(0, maxBranchStepsCount)
                  : branchTrace.steps;

              const combinedSteps = [
                ...enrichedPrefix.steps,
                ...trimmedBranchSteps,
              ];

              const truncated =
                combinedSteps.length <
                enrichedPrefix.steps.length + branchTrace.steps.length;

              const hasHotWalletWithinLimit =
                branchTrace.success && !truncated;

              const touchesMain = combinedSteps.some(
                (s) =>
                  mainPathAddresses.has(
                    normalizeAddress(s.fromAddress),
                  ) ||
                  mainPathAddresses.has(normalizeAddress(s.toAddress)),
              );

              if (!hasHotWalletWithinLimit && !touchesMain) {
                continue;
              }

              const combinedEdgesFull = [
                ...enrichedPrefix.edges,
                ...branchTrace.graph.edges,
              ];
              const combinedEdges = combinedEdgesFull.slice(
                0,
                MAX_BRANCH_HOPS,
              );

              extraFlowResults.push({
                ...branchTrace,
                steps: combinedSteps,
                graph: {
                  nodes: branchTrace.graph.nodes,
                  edges: combinedEdges,
                },
              });

              extraCreatedByFrom.add(from);
            }
          }

          flowResultsForSeed = [flowResult, ...extraFlowResults];
        }

        for (const fr of flowResultsForSeed) {
          const firstStep = fr.steps[0];
          const tokenSymbol = firstStep?.transfer.symbol ?? null;
          const tokenAddress = firstStep?.transfer.contract ?? null;
          const totalAmountRaw = firstStep?.transfer.rawAmount ?? '0';
          const totalAmountDecimal =
            firstStep?.transfer.amount?.toString() ?? '0';
          const endpointReason = mapToEndpointReason(fr);

          let endpointHotWalletId: string | null = null;
          if (fr.success) {
            const hw = await this.prisma.hotWallet.findFirst({
              where: {
                chainId,
                address: normalizeAddress(fr.endpointAddress),
              },
              select: { id: true },
            });
            endpointHotWalletId = hw?.id ?? null;
          }

          const flowRecord = await this.prisma.flow.create({
            data: {
              caseId,
              seedId: seedRecord.id,
              chainId,
              tokenAddress,
              tokenSymbol,
              totalAmountRaw,
              totalAmountDecimal,
              hopsCount: fr.steps.length,
              endpointAddress: fr.success ? fr.endpointAddress : fr.lastWallet,
              endpointReason,
              endpointHotWalletId,
              isEndpointExchange: fr.success,
            },
          });
          flowsCount++;

          const txData = fr.steps.map((s: FlowStep, hopIndex: number) => ({
            flowId: flowRecord.id,
            chainId,
            hopIndex,
            txHash: s.transfer.txHash,
            fromAddress: s.fromAddress,
            toAddress: s.toAddress,
            tokenAddress: s.transfer.contract ?? null,
            tokenSymbol: s.transfer.symbol,
            amountRaw: s.transfer.rawAmount,
            amountDecimal: s.transfer.amount.toString(),
            timestamp: parseTimestamp(s.transfer.timestamp),
            isEndpointHop: hopIndex === fr.steps.length - 1,
          }));
          await this.prisma.flowTransaction.createMany({ data: txData });

          const edgeData = fr.graph.edges.map(
            (edge: FlowGraphEdge, stepIndex: number) => ({
              flowId: flowRecord.id,
              stepIndex,
              fromAddress: edge.from,
              toAddress: edge.to,
              transferSymbol: edge.symbol,
              transferAmountRaw: edge.amountRaw,
              transferAmountDecimal: edge.amount.toString(),
              txHash: edge.txHash,
              outcome: edge.outcome ?? null,
              transferTimestamp: edge.timestamp
                ? parseTimestamp(edge.timestamp)
                : null,
            }),
          );
          await this.prisma.flowEdge.createMany({ data: edgeData });

          const pathAddresses: string[] = [
            fr.steps[0].fromAddress,
            ...fr.steps.map((s: FlowStep) => s.toAddress),
          ];
          const walletData = pathAddresses.map((address, nodeIndex) => ({
            flowId: flowRecord.id,
            nodeIndex,
            address,
            nickname: null,
            position: 'default' as const,
          }));
          await this.prisma.flowWallet.createMany({ data: walletData });
        }
      }

      const successCount = flowResults.filter(
        (r) => r.flowResult.success,
      ).length;
      const failedCount = flowResults.filter(
        (r) => !r.flowResult.success,
      ).length;
      let finalStatus: CaseStatus = CaseStatus.PROCESSING;
      if (successCount === flowResults.length)
        finalStatus = CaseStatus.COMPLETED;
      else if (failedCount === flowResults.length)
        finalStatus = CaseStatus.FAILED;
      else finalStatus = CaseStatus.PARTIALLY;

      await this.prisma.case.update({
        where: { id: caseId },
        data: { status: finalStatus },
      });

      const seedsCreated = await this.prisma.caseSeedTransaction.count({
        where: { caseId },
      });

      this.socketGateway.emitToRoom(traceId, CASE_CREATED_EVENT, {
        caseId,
        name,
        status: finalStatus,
        seedsCount: seedsCreated,
        flowsCount,
      });
    } catch {
      await this.prisma.case.update({
        where: { id: caseId },
        data: { status: CaseStatus.FAILED },
      });
      this.socketGateway.emitToRoom(traceId, CASE_CREATED_EVENT, {
        caseId,
        name,
        status: CaseStatus.FAILED,
        seedsCount: 0,
        flowsCount: 0,
      });
    }
  }
}

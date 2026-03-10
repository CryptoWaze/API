import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateCaseInput } from '../schemas/create-case.schema';
import type {
  FollowFlowToExchangeFullHistoryResult,
  FlowGraphEdge,
  FlowStep,
  ResolveTransactionResult,
} from '../types';
import { ResolveTransactionUseCase } from './resolve-transaction.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from './follow-flow-to-exchange-full-history.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CaseStatus, FlowEndpointReason } from '../../generated/prisma';
import { SocketGateway } from '../../presentation/socket/socket.gateway';

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
  ) {}

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

    void this.runInBackground(input, caseRecord.id, traceId);

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

        const firstStep = flowResult.steps[0];
        const tokenSymbol = firstStep?.transfer.symbol ?? null;
        const tokenAddress = firstStep?.transfer.contract ?? null;
        const totalAmountRaw = firstStep?.transfer.rawAmount ?? '0';
        const totalAmountDecimal =
          firstStep?.transfer.amount?.toString() ?? '0';
        const endpointReason = mapToEndpointReason(flowResult);

        let endpointHotWalletId: string | null = null;
        if (flowResult.success) {
          const hw = await this.prisma.hotWallet.findFirst({
            where: {
              chainId,
              address: normalizeAddress(flowResult.endpointAddress),
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
            hopsCount: flowResult.steps.length,
            endpointAddress: flowResult.success
              ? flowResult.endpointAddress
              : flowResult.lastWallet,
            endpointReason,
            endpointHotWalletId,
            isEndpointExchange: flowResult.success,
          },
        });
        flowsCount++;

        const txData = flowResult.steps.map(
          (step: FlowStep, hopIndex: number) => ({
            flowId: flowRecord.id,
            chainId,
            hopIndex,
            txHash: step.transfer.txHash,
            fromAddress: step.fromAddress,
            toAddress: step.toAddress,
            tokenAddress: step.transfer.contract ?? null,
            tokenSymbol: step.transfer.symbol,
            amountRaw: step.transfer.rawAmount,
            amountDecimal: step.transfer.amount.toString(),
            timestamp: parseTimestamp(step.transfer.timestamp),
            isEndpointHop: hopIndex === flowResult.steps.length - 1,
          }),
        );
        await this.prisma.flowTransaction.createMany({ data: txData });

        const edgeData = flowResult.graph.edges.map(
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

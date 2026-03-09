import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type CaseSeedTransactionDto = {
  id: string;
  txHash: string;
  initialWalletAddresses: string[];
  flowIds: string[];
  chainSlug: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  amountRaw: string;
  amountDecimal: string;
  timestamp: string;
};

export type FlowTransactionDto = {
  id: string;
  hopIndex: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  amountRaw: string;
  amountDecimal: string;
  timestamp: string;
  isEndpointHop: boolean;
};

export type FlowEdgeDto = {
  id: string;
  stepIndex: number;
  fromAddress: string;
  toAddress: string;
  transferSymbol: string | null;
  transferAmountRaw: string | null;
  transferAmountDecimal: string | null;
  txHash: string | null;
  tokenAddress: string | null;
  transferTimestamp: string | null;
  outcome: string | null;
};

export type FlowDto = {
  id: string;
  seedId: string;
  chainSlug: string;
  initialWalletAddress: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  totalAmountRaw: string;
  totalAmountDecimal: string;
  hopsCount: number;
  endpointAddress: string;
  endpointReason: string;
  endpointIsHotWallet: boolean;
  endpointExchangeName: string | null;
  endpointExchangeSlug: string | null;
  endpointHotWalletLabel: string | null;
  transactions: FlowTransactionDto[];
  edges: FlowEdgeDto[];
};

export type MappingRootBranchDto = {
  flowId: string;
  initialWalletAddress: string;
};

export type MappingRootDto = {
  seedId: string;
  txHash: string;
  branches: MappingRootBranchDto[];
};

export type MappingConnectionDto = {
  flowId: string;
  fromAddress: string;
  toAddress: string;
  stepIndex: number;
};

export type CaseMappingDto = {
  roots: MappingRootDto[];
  connections: MappingConnectionDto[];
};

export type GetCaseByIdResult = {
  id: string;
  name: string;
  status: string;
  totalAmountLostRaw: string;
  totalAmountLostDecimal: string;
  createdAt: string;
  updatedAt: string;
  seeds: CaseSeedTransactionDto[];
  flows: FlowDto[];
  mapping: CaseMappingDto;
};

@Injectable()
export class GetCaseByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string): Promise<GetCaseByIdResult> {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id },
      include: {
        seeds: { include: { chain: { select: { slug: true } } } },
        flows: {
          include: {
            chain: { select: { slug: true } },
            seed: true,
            endpointHotWallet: {
              include: {
                exchange: { select: { name: true, slug: true } },
              },
            },
            transactions: { orderBy: { hopIndex: 'asc' } },
            edges: { orderBy: { stepIndex: 'asc' } },
          },
        },
      },
    });

    if (!caseRecord) {
      throw new NotFoundException('Caso não encontrado.');
    }
    if (caseRecord.createdByUserId !== userId) {
      throw new NotFoundException('Caso não encontrado.');
    }

    const flowsBySeedId = new Map<string, typeof caseRecord.flows>();
    for (const f of caseRecord.flows) {
      const list = flowsBySeedId.get(f.seedId) ?? [];
      list.push(f);
      flowsBySeedId.set(f.seedId, list);
    }

    return {
      id: caseRecord.id,
      name: caseRecord.name,
      status: caseRecord.status,
      totalAmountLostRaw: caseRecord.totalAmountLostRaw,
      totalAmountLostDecimal: caseRecord.totalAmountLostDecimal,
      createdAt: caseRecord.createdAt.toISOString(),
      updatedAt: caseRecord.updatedAt.toISOString(),
      seeds: caseRecord.seeds.map((s) => {
        const seedFlows = flowsBySeedId.get(s.id) ?? [];
        const initialWalletAddresses = seedFlows
          .map((f) => f.transactions[0]?.fromAddress)
          .filter((addr): addr is string => addr != null && addr !== '');
        const flowIds = seedFlows.map((f) => f.id);
        return {
          id: s.id,
          txHash: s.txHash,
          initialWalletAddresses,
          flowIds,
          chainSlug: s.chain.slug,
          tokenAddress: s.tokenAddress,
          tokenSymbol: s.tokenSymbol,
          amountRaw: s.amountRaw,
          amountDecimal: s.amountDecimal,
          timestamp: s.timestamp.toISOString(),
        };
      }),
      flows: caseRecord.flows.map((f) => {
        const initialWallet = f.transactions[0]?.fromAddress ?? '';
        const exchange = f.endpointHotWallet?.exchange;
        const endpointIsHotWallet = f.endpointHotWallet != null;
        const endpointHotWalletLabel =
          endpointIsHotWallet ? 'Hot Wallet' : null;
        return {
          id: f.id,
          seedId: f.seedId,
          chainSlug: f.chain.slug,
          initialWalletAddress: initialWallet,
          tokenAddress: f.tokenAddress,
          tokenSymbol: f.tokenSymbol,
          totalAmountRaw: f.totalAmountRaw,
          totalAmountDecimal: f.totalAmountDecimal,
          hopsCount: f.hopsCount,
          endpointAddress: f.endpointAddress,
          endpointReason: f.endpointReason,
          endpointIsHotWallet,
          endpointExchangeName: exchange?.name ?? null,
          endpointExchangeSlug: exchange?.slug ?? null,
          endpointHotWalletLabel,
          transactions: f.transactions.map((t) => ({
            id: t.id,
            hopIndex: t.hopIndex,
            txHash: t.txHash,
            fromAddress: t.fromAddress,
            toAddress: t.toAddress,
            tokenAddress: t.tokenAddress,
            tokenSymbol: t.tokenSymbol,
            amountRaw: t.amountRaw,
            amountDecimal: t.amountDecimal,
            timestamp: t.timestamp.toISOString(),
            isEndpointHop: t.isEndpointHop,
          })),
          edges: f.edges.map((e) => ({
            id: e.id,
            stepIndex: e.stepIndex,
            fromAddress: e.fromAddress,
            toAddress: e.toAddress,
            transferSymbol: e.transferSymbol,
            transferAmountRaw: e.transferAmountRaw,
            transferAmountDecimal: e.transferAmountDecimal,
            txHash: e.txHash,
            tokenAddress: e.tokenAddress,
            transferTimestamp: e.transferTimestamp
              ? e.transferTimestamp.toISOString()
              : null,
            outcome: e.outcome,
          })),
        };
      }),
      mapping: {
        roots: caseRecord.seeds.map((s) => {
          const seedFlows = flowsBySeedId.get(s.id) ?? [];
          const branches: MappingRootBranchDto[] = seedFlows
            .map((f) => ({
              flowId: f.id,
              initialWalletAddress: f.transactions[0]?.fromAddress ?? '',
            }))
            .filter((b) => b.initialWalletAddress !== '');
          return {
            seedId: s.id,
            txHash: s.txHash,
            branches,
          };
        }),
        connections: caseRecord.flows.flatMap((f) =>
          f.edges.map((e) => ({
            flowId: f.id,
            fromAddress: e.fromAddress,
            toAddress: e.toAddress,
            stepIndex: e.stepIndex,
          })),
        ),
      },
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type CaseSeedTransactionDto = {
  id: string;
  txHash: string;
  initialWalletAddresses: string[];
  flowIds: string[];
  chainSlug: string;
  chainName: string | null;
  chainIconUrl: string | null;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  tokenPriceUsd: number | null;
  tokenImageUrl: string | null;
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
  tokenPriceUsd: number | null;
  tokenImageUrl: string | null;
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
  tokenPriceUsd: number | null;
  tokenImageUrl: string | null;
};

export type FlowDto = {
  id: string;
  seedId: string;
  chainSlug: string;
  chainName: string | null;
  chainIconUrl: string | null;
  initialWalletAddress: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  tokenPriceUsd: number | null;
  tokenImageUrl: string | null;
  totalAmountRaw: string;
  totalAmountDecimal: string;
  hopsCount: number;
  endpointAddress: string;
  endpointReason: string;
  endpointIsHotWallet: boolean;
  endpointExchangeName: string | null;
  endpointExchangeSlug: string | null;
  endpointExchangeIconUrl: string | null;
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

type TokenInfoEntry = { priceUsd: number | null; imageUrl: string | null };

@Injectable()
export class GetCaseByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private async loadTokenInfoMap(
    symbols: string[],
  ): Promise<Map<string, TokenInfoEntry>> {
    const normalized = [...new Set(symbols.map((s) => s.trim().toLowerCase()))];
    if (normalized.length === 0) return new Map();
    const tokens = await this.prisma.token.findMany({
      where: { symbol: { in: normalized } },
      select: { symbol: true, currentPrice: true, imageUrl: true },
    });
    const map = new Map<string, TokenInfoEntry>();
    for (const sym of normalized) {
      const token = tokens.find((t) => t.symbol === sym);
      const priceUsd =
        token?.currentPrice != null && token.currentPrice !== ''
          ? Number.parseFloat(token.currentPrice)
          : null;
      map.set(sym, {
        priceUsd:
          priceUsd != null && !Number.isNaN(priceUsd) ? priceUsd : null,
        imageUrl: token?.imageUrl ?? null,
      });
    }
    return map;
  }

  async execute(id: string, userId: string): Promise<GetCaseByIdResult> {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id },
      include: {
        seeds: {
          include: {
            chain: { select: { slug: true, name: true, iconUrl: true } },
          },
        },
        flows: {
          include: {
            chain: { select: { slug: true, name: true, iconUrl: true } },
            seed: true,
            endpointHotWallet: {
              include: {
                exchange: {
                  select: { name: true, slug: true, iconUrl: true },
                },
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

    const symbols = new Set<string>();
    for (const s of caseRecord.seeds) {
      if (s.tokenSymbol) symbols.add(s.tokenSymbol.trim().toLowerCase());
    }
    for (const f of caseRecord.flows) {
      if (f.tokenSymbol) symbols.add(f.tokenSymbol.trim().toLowerCase());
      for (const t of f.transactions) {
        if (t.tokenSymbol) symbols.add(t.tokenSymbol.trim().toLowerCase());
      }
      for (const e of f.edges) {
        if (e.transferSymbol)
          symbols.add(e.transferSymbol.trim().toLowerCase());
      }
    }
    const tokenInfoBySymbol = await this.loadTokenInfoMap([
      ...symbols,
    ]);

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
        const sym = s.tokenSymbol?.trim().toLowerCase();
        const tokenInfo = sym ? tokenInfoBySymbol.get(sym) : null;
        return {
          id: s.id,
          txHash: s.txHash,
          initialWalletAddresses,
          flowIds,
          chainSlug: s.chain.slug,
          chainName: s.chain.name,
          chainIconUrl: s.chain.iconUrl,
          tokenAddress: s.tokenAddress,
          tokenSymbol: s.tokenSymbol,
          tokenPriceUsd: tokenInfo?.priceUsd ?? null,
          tokenImageUrl: tokenInfo?.imageUrl ?? null,
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
        const flowSym = f.tokenSymbol?.trim().toLowerCase();
        const flowTokenInfo = flowSym ? tokenInfoBySymbol.get(flowSym) : null;
        return {
          id: f.id,
          seedId: f.seedId,
          chainSlug: f.chain.slug,
          chainName: f.chain.name,
          chainIconUrl: f.chain.iconUrl,
          initialWalletAddress: initialWallet,
          tokenAddress: f.tokenAddress,
          tokenSymbol: f.tokenSymbol,
          tokenPriceUsd: flowTokenInfo?.priceUsd ?? null,
          tokenImageUrl: flowTokenInfo?.imageUrl ?? null,
          totalAmountRaw: f.totalAmountRaw,
          totalAmountDecimal: f.totalAmountDecimal,
          hopsCount: f.hopsCount,
          endpointAddress: f.endpointAddress,
          endpointReason: f.endpointReason,
          endpointIsHotWallet,
          endpointExchangeName: exchange?.name ?? null,
          endpointExchangeSlug: exchange?.slug ?? null,
          endpointExchangeIconUrl: exchange?.iconUrl ?? null,
          endpointHotWalletLabel,
          transactions: f.transactions.map((t) => {
            const tSym = t.tokenSymbol?.trim().toLowerCase();
            const tInfo = tSym ? tokenInfoBySymbol.get(tSym) : null;
            return {
              id: t.id,
              hopIndex: t.hopIndex,
              txHash: t.txHash,
              fromAddress: t.fromAddress,
              toAddress: t.toAddress,
              tokenAddress: t.tokenAddress,
              tokenSymbol: t.tokenSymbol,
              tokenPriceUsd: tInfo?.priceUsd ?? null,
              tokenImageUrl: tInfo?.imageUrl ?? null,
              amountRaw: t.amountRaw,
              amountDecimal: t.amountDecimal,
              timestamp: t.timestamp.toISOString(),
              isEndpointHop: t.isEndpointHop,
            };
          }),
          edges: f.edges.map((e) => {
            const eSym = e.transferSymbol?.trim().toLowerCase();
            const eInfo = eSym ? tokenInfoBySymbol.get(eSym) : null;
            return {
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
              tokenPriceUsd: eInfo?.priceUsd ?? null,
              tokenImageUrl: eInfo?.imageUrl ?? null,
            };
          }),
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

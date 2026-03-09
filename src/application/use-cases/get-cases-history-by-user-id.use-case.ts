import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type CaseHistorySeedDto = {
  id: string;
  txHash: string;
};

export type CaseHistoryItemDto = {
  id: string;
  name: string;
  totalAmountLostRaw: string;
  totalAmountLostDecimal: string;
  createdAt: string;
  seeds: CaseHistorySeedDto[];
};

@Injectable()
export class GetCasesHistoryByUserIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<CaseHistoryItemDto[]> {
    const cases = await this.prisma.case.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        totalAmountLostRaw: true,
        totalAmountLostDecimal: true,
        createdAt: true,
        seeds: { select: { id: true, txHash: true } },
      },
    });
    return cases.map((c) => ({
      id: c.id,
      name: c.name,
      totalAmountLostRaw: c.totalAmountLostRaw,
      totalAmountLostDecimal: c.totalAmountLostDecimal,
      createdAt: c.createdAt.toISOString(),
      seeds: c.seeds.map((s) => ({ id: s.id, txHash: s.txHash })),
    }));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type UserDashboardCaseItem = {
  id: string;
  name: string;
  createdAt: string;
  valueUSD: string;
  transactionCount: number;
};

export type GetUserDashboardResult = {
  totalCases: number;
  totalTrackedValueUSD: number;
  casesThisMonth: number;
  totalTrackedTransactions: number;
  caseHistory: UserDashboardCaseItem[];
};

@Injectable()
export class GetUserDashboardUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<GetUserDashboardResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const cases = await this.prisma.case.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        totalAmountLostDecimal: true,
        createdAt: true,
        flows: {
          where: { deletedAt: null },
          select: {
            transactions: {
              where: { deletedAt: null },
              select: { id: true },
            },
          },
        },
      },
    });

    let totalTrackedValueUSD = 0;
    let casesThisMonth = 0;
    let totalTrackedTransactions = 0;

    for (const c of cases) {
      const value = parseFloat(c.totalAmountLostDecimal);
      if (!Number.isNaN(value)) totalTrackedValueUSD += value;
      if (c.createdAt >= startOfMonth) casesThisMonth += 1;
      for (const f of c.flows) {
        totalTrackedTransactions += f.transactions.length;
      }
    }

    const caseHistory: UserDashboardCaseItem[] = cases.map((c) => {
      const flowCount = c.flows.length;
      return {
        id: c.id,
        name: c.name,
        createdAt: c.createdAt.toISOString(),
        valueUSD: c.totalAmountLostDecimal,
        transactionCount: flowCount,
      };
    });

    return {
      totalCases: cases.length,
      totalTrackedValueUSD: Math.round(totalTrackedValueUSD * 100) / 100,
      casesThisMonth,
      totalTrackedTransactions,
      caseHistory,
    };
  }
}

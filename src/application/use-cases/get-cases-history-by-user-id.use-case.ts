import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type CaseHistoryItemDto = {
  id: string;
  name: string;
  totalAmountLostRaw: string;
  totalAmountLostDecimal: string;
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
      },
    });
    return cases;
  }
}

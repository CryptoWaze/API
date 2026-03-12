import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type CaseReportListItem = {
  id: string;
  caseId: string;
  format: string;
  generatedAt: string;
  createdAt: string;
};

@Injectable()
export class ListCaseReportsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    caseId: string,
    userId: string,
  ): Promise<CaseReportListItem[]> {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, createdByUserId: true },
    });
    if (!caseRecord) {
      throw new NotFoundException('Caso não encontrado.');
    }
    if (caseRecord.createdByUserId !== userId) {
      throw new NotFoundException('Caso não encontrado.');
    }

    const reports = await this.prisma.caseReport.findMany({
      where: { caseId },
      orderBy: { generatedAt: 'desc' },
    });

    return reports.map((r) => ({
      id: r.id,
      caseId: r.caseId,
      format: r.format,
      generatedAt: r.generatedAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

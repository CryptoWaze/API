import { Injectable } from '@nestjs/common';
import { GenerateCaseReportUseCase } from './generate-case-report.use-case';
import { GetCaseByIdUseCase } from './get-case-by-id.use-case';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type GetOrCreateCaseReportResult = {
  generated: boolean;
  reports: Array<{
    id: string;
    caseId: string;
    format: string;
    generatedAt: string;
    createdAt: string;
  }>;
};

@Injectable()
export class GetOrCreateCaseReportUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getCaseByIdUseCase: GetCaseByIdUseCase,
    private readonly generateCaseReportUseCase: GenerateCaseReportUseCase,
  ) {}

  async execute(
    caseId: string,
    userId: string,
  ): Promise<GetOrCreateCaseReportResult> {
    await this.getCaseByIdUseCase.execute(caseId, userId);

    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { updatedAt: true },
    });
    if (!caseRecord) {
      throw new Error('Case not found');
    }

    const latestReports = await this.prisma.caseReport.findMany({
      where: { caseId },
      orderBy: { generatedAt: 'desc' },
      take: 2,
    });

    const latestGeneratedAt =
      latestReports.length > 0
        ? latestReports.reduce(
            (max, r) => (r.generatedAt > max ? r.generatedAt : max),
            latestReports[0].generatedAt,
          )
        : null;

    const mustGenerate =
      latestGeneratedAt == null ||
      caseRecord.updatedAt > latestGeneratedAt;

    if (mustGenerate) {
      const result = await this.generateCaseReportUseCase.execute(
        caseId,
        userId,
      );
      return {
        generated: true,
        reports: result.reports.map((r) => ({
          id: r.id,
          caseId: r.caseId,
          format: r.format,
          generatedAt: r.generatedAt,
          createdAt: r.createdAt,
        })),
      };
    }

    const byLatestAt = new Date(
      Math.max(...latestReports.map((r) => r.generatedAt.getTime())),
    );
    const existing = await this.prisma.caseReport.findMany({
      where: {
        caseId,
        generatedAt: byLatestAt,
      },
      orderBy: { format: 'asc' },
    });

    return {
      generated: false,
      reports: existing.map((r) => ({
        id: r.id,
        caseId: r.caseId,
        format: r.format,
        generatedAt: r.generatedAt.toISOString(),
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }
}

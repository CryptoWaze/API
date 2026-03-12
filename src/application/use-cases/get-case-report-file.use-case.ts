import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPORT_STORAGE, type IReportStorage } from '../ports/report-storage.port';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type GetCaseReportFileResult = {
  body: Buffer;
  contentType: string;
  fileName: string;
};

@Injectable()
export class GetCaseReportFileUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REPORT_STORAGE) private readonly storage: IReportStorage,
  ) {}

  async execute(
    caseId: string,
    reportId: string,
    userId: string,
  ): Promise<GetCaseReportFileResult> {
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

    const report = await this.prisma.caseReport.findFirst({
      where: { id: reportId, caseId },
    });
    if (!report) {
      throw new NotFoundException('Relatório não encontrado.');
    }

    const { body, contentType } = await this.storage.get(report.storageKey);
    const ext = report.format === 'PDF' ? 'pdf' : 'docx';
    const fileName = `relatorio-${caseId}-${report.generatedAt.toISOString().slice(0, 10)}.${ext}`;

    return {
      body,
      contentType,
      fileName,
    };
  }
}

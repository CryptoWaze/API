import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import HTMLtoDOCX from 'html-to-docx';
import { REPORT_STORAGE, type IReportStorage } from '../ports/report-storage.port';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ReportFormat } from '../../generated/prisma';
import { GetCaseByIdUseCase } from './get-case-by-id.use-case';
import { buildReportTemplateData } from '../reports/build-report-template-data';

export type GenerateCaseReportResult = {
  reports: Array<{
    id: string;
    caseId: string;
    format: 'PDF' | 'DOCX';
    generatedAt: string;
    createdAt: string;
  }>;
};

@Injectable()
export class GenerateCaseReportUseCase {
  constructor(
    private readonly getCaseByIdUseCase: GetCaseByIdUseCase,
    @Inject(REPORT_STORAGE) private readonly storage: IReportStorage,
    private readonly prisma: PrismaService,
  ) {}

  async execute(caseId: string, userId: string): Promise<GenerateCaseReportResult> {
    const caseData = await this.getCaseByIdUseCase.execute(caseId, userId);
    const generatedAt = new Date().toISOString();
    const templateData = buildReportTemplateData(caseData, generatedAt);

    const templatePath = join(
      __dirname,
      '..',
      '..',
      'templates',
      'report',
      'report.hbs',
    );
    const templateSource = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    const html = template(templateData);

    const pdfBuffer = await this.htmlToPdf(html);
    const docxBuffer = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      font: 'Segoe UI',
    });

    const generatedAtDate = new Date();
    const reportIdPdf = randomUUID();
    const reportIdDocx = randomUUID();
    const storageKeyPdf = `reports/${caseId}/${reportIdPdf}.pdf`;
    const storageKeyDocx = `reports/${caseId}/${reportIdDocx}.docx`;

    await this.storage.put(storageKeyPdf, Buffer.from(pdfBuffer), 'application/pdf');
    await this.storage.put(
      storageKeyDocx,
      Buffer.isBuffer(docxBuffer) ? docxBuffer : Buffer.from(docxBuffer as ArrayBuffer),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    const [createdPdf, createdDocx] = await Promise.all([
      this.prisma.caseReport.create({
        data: {
          id: reportIdPdf,
          caseId,
          format: ReportFormat.PDF,
          generatedAt: generatedAtDate,
          storageKey: storageKeyPdf,
        },
      }),
      this.prisma.caseReport.create({
        data: {
          id: reportIdDocx,
          caseId,
          format: ReportFormat.DOCX,
          generatedAt: generatedAtDate,
          storageKey: storageKeyDocx,
        },
      }),
    ]);

    return {
      reports: [
        {
          id: createdPdf.id,
          caseId: createdPdf.caseId,
          format: createdPdf.format,
          generatedAt: createdPdf.generatedAt.toISOString(),
          createdAt: createdPdf.createdAt.toISOString(),
        },
        {
          id: createdDocx.id,
          caseId: createdDocx.caseId,
          format: createdDocx.format,
          generatedAt: createdDocx.generatedAt.toISOString(),
          createdAt: createdDocx.createdAt.toISOString(),
        },
      ],
    };
  }

  private async htmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });
      return (await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      })) as Buffer;
    } finally {
      await browser.close();
    }
  }
}

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetCaseReportFileUseCase } from '../../../../src/application/use-cases/get-case-report-file.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';
import { REPORT_STORAGE } from '../../../../src/application/ports/report-storage.port';

describe('GetCaseReportFileUseCase', () => {
  let useCase: GetCaseReportFileUseCase;
  let prisma: { case: { findUnique: jest.Mock }; caseReport: { findFirst: jest.Mock } };
  let storage: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      case: { findUnique: jest.fn() },
      caseReport: { findFirst: jest.fn() },
    };
    storage = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCaseReportFileUseCase,
        { provide: PrismaService, useValue: prisma },
        { provide: REPORT_STORAGE, useValue: storage },
      ],
    }).compile();

    useCase = module.get(GetCaseReportFileUseCase);
  });

  it('throws NotFoundException when case does not exist', async () => {
    prisma.case.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'report-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when user is not case owner', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      createdByUserId: 'other-user',
    });

    await expect(
      useCase.execute('case-1', 'report-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when report does not exist', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      createdByUserId: 'user-1',
    });
    prisma.caseReport.findFirst.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'report-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('returns body, contentType and fileName from storage', async () => {
    const generatedAt = new Date('2024-01-15');
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      createdByUserId: 'user-1',
    });
    prisma.caseReport.findFirst.mockResolvedValue({
      id: 'report-1',
      caseId: 'case-1',
      format: 'PDF',
      storageKey: 'key-1',
      generatedAt,
    });
    storage.get.mockResolvedValue({
      body: Buffer.from('pdf-content'),
      contentType: 'application/pdf',
    });

    const result = await useCase.execute('case-1', 'report-1', 'user-1');

    expect(result.body).toEqual(Buffer.from('pdf-content'));
    expect(result.contentType).toBe('application/pdf');
    expect(result.fileName).toContain('relatorio-case-1-2024-01-15.pdf');
  });
});

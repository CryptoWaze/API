import { Test, TestingModule } from '@nestjs/testing';
import { GetOrCreateCaseReportUseCase } from '../../../../src/application/use-cases/get-or-create-case-report.use-case';
import { GetCaseByIdUseCase } from '../../../../src/application/use-cases/get-case-by-id.use-case';
import { GenerateCaseReportUseCase } from '../../../../src/application/use-cases/generate-case-report.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('GetOrCreateCaseReportUseCase', () => {
  let useCase: GetOrCreateCaseReportUseCase;
  let getCaseById: jest.Mock;
  let generateCaseReport: jest.Mock;
  let prisma: {
    case: { findUnique: jest.Mock };
    caseReport: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    getCaseById = jest.fn().mockResolvedValue(undefined);
    generateCaseReport = jest.fn();
    prisma = {
      case: { findUnique: jest.fn() },
      caseReport: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrCreateCaseReportUseCase,
        { provide: GetCaseByIdUseCase, useValue: { execute: getCaseById } },
        {
          provide: GenerateCaseReportUseCase,
          useValue: { execute: generateCaseReport },
        },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(GetOrCreateCaseReportUseCase);
  });

  it('generates new report when case updated after latest report', async () => {
    prisma.case.findUnique.mockResolvedValue({
      updatedAt: new Date('2024-01-10'),
    });
    prisma.caseReport.findMany.mockResolvedValue([
      {
        id: 'r1',
        caseId: 'case-1',
        format: 'PDF',
        generatedAt: new Date('2024-01-05'),
        createdAt: new Date('2024-01-05'),
      },
    ]);
    generateCaseReport.mockResolvedValue({
      reports: [
        {
          id: 'r2',
          caseId: 'case-1',
          format: 'PDF',
          generatedAt: '2024-01-10T00:00:00.000Z',
          createdAt: '2024-01-10T00:00:00.000Z',
        },
      ],
    });

    const result = await useCase.execute('case-1', 'user-1');

    expect(result.generated).toBe(true);
    expect(result.reports).toHaveLength(1);
    expect(result.reports[0].id).toBe('r2');
    expect(generateCaseReport).toHaveBeenCalledWith('case-1', 'user-1');
  });

  it('returns existing reports when case not updated after latest report', async () => {
    const generatedAt = new Date('2024-01-10');
    const createdAt = new Date('2024-01-10');
    prisma.case.findUnique.mockResolvedValue({
      updatedAt: new Date('2024-01-05'),
    });
    prisma.caseReport.findMany
      .mockResolvedValueOnce([
        {
          id: 'r1',
          caseId: 'case-1',
          format: 'PDF',
          generatedAt,
          createdAt,
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'r1',
          caseId: 'case-1',
          format: 'PDF',
          generatedAt,
          createdAt,
        },
      ]);

    const result = await useCase.execute('case-1', 'user-1');

    expect(result.generated).toBe(false);
    expect(result.reports).toHaveLength(1);
    expect(result.reports[0].generatedAt).toBe(generatedAt.toISOString());
    expect(generateCaseReport).not.toHaveBeenCalled();
  });
});

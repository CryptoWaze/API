import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListCaseReportsUseCase } from '../../../../src/application/use-cases/list-case-reports.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('ListCaseReportsUseCase', () => {
  let useCase: ListCaseReportsUseCase;
  let prisma: { case: { findUnique: jest.Mock }; caseReport: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      case: { findUnique: jest.fn() },
      caseReport: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListCaseReportsUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(ListCaseReportsUseCase);
  });

  it('throws NotFoundException when case does not exist', async () => {
    prisma.case.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('case-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when user is not case owner', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      createdByUserId: 'other-user',
    });

    await expect(useCase.execute('case-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns list of reports for case owner', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      createdByUserId: 'user-1',
    });
    const generatedAt = new Date('2024-01-01');
    const createdAt = new Date('2024-01-02');
    prisma.caseReport.findMany.mockResolvedValue([
      {
        id: 'report-1',
        caseId: 'case-1',
        format: 'PDF',
        generatedAt,
        createdAt,
      },
    ]);

    const result = await useCase.execute('case-1', 'user-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'report-1',
      caseId: 'case-1',
      format: 'PDF',
      generatedAt: generatedAt.toISOString(),
      createdAt: createdAt.toISOString(),
    });
  });
});

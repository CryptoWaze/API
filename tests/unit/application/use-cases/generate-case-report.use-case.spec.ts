import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCaseReportUseCase } from '../../../../src/application/use-cases/generate-case-report.use-case';
import { GetCaseByIdUseCase } from '../../../../src/application/use-cases/get-case-by-id.use-case';
import { REPORT_STORAGE } from '../../../../src/application/ports/report-storage.port';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('GenerateCaseReportUseCase', () => {
  let useCase: GenerateCaseReportUseCase;
  let getCaseByIdUseCase: jest.Mocked<GetCaseByIdUseCase>;
  let storage: { put: jest.Mock };
  let prisma: { caseReport: { create: jest.Mock } };

  beforeEach(async () => {
    getCaseByIdUseCase = { execute: jest.fn() };
    storage = { put: jest.fn().mockResolvedValue(undefined) };
    prisma = {
      caseReport: {
        create: jest.fn().mockImplementation((args: { data: { id: string; caseId: string; format: string; generatedAt: Date; storageKey: string } }) =>
          Promise.resolve({
            id: args.data.id,
            caseId: args.data.caseId,
            format: args.data.format,
            generatedAt: args.data.generatedAt,
            createdAt: args.data.generatedAt,
          }),
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCaseReportUseCase,
        { provide: GetCaseByIdUseCase, useValue: getCaseByIdUseCase },
        { provide: REPORT_STORAGE, useValue: storage },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(GenerateCaseReportUseCase);
  });

  it('throws NotFoundException when getCaseById throws', async () => {
    getCaseByIdUseCase.execute.mockRejectedValue(
      new NotFoundException('Caso não encontrado.'),
    );

    await expect(
      useCase.execute('case-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
    expect(getCaseByIdUseCase.execute).toHaveBeenCalledWith('case-1', 'user-1');
  });

  it('calls getCaseById with caseId and userId', async () => {
    getCaseByIdUseCase.execute.mockRejectedValue(
      new Error('Template not found'),
    );

    await expect(
      useCase.execute('case-1', 'user-1'),
    ).rejects.toThrow();

    expect(getCaseByIdUseCase.execute).toHaveBeenCalledWith('case-1', 'user-1');
  });
});

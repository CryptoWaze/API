import { Test, TestingModule } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { CasesController } from '../../../../src/presentation/cases/cases.controller';
import { CreateCaseUseCase } from '../../../../src/application/use-cases/create-case.use-case';
import { GetCaseByIdUseCase } from '../../../../src/application/use-cases/get-case-by-id.use-case';
import { GetCasesHistoryByUserIdUseCase } from '../../../../src/application/use-cases/get-cases-history-by-user-id.use-case';
import { UpdateFlowWalletUseCase } from '../../../../src/application/use-cases/update-flow-wallet.use-case';
import { UpdateCaseUseCase } from '../../../../src/application/use-cases/update-case.use-case';
import { SoftDeleteFlowUseCase } from '../../../../src/application/use-cases/soft-delete-flow.use-case';
import { SoftDeleteFlowTransactionUseCase } from '../../../../src/application/use-cases/soft-delete-flow-transaction.use-case';
import { EditCaseUseCase } from '../../../../src/application/use-cases/edit-case.use-case';
import { ListCaseReportsUseCase } from '../../../../src/application/use-cases/list-case-reports.use-case';
import { GetCaseReportFileUseCase } from '../../../../src/application/use-cases/get-case-report-file.use-case';
import { GetOrCreateCaseReportUseCase } from '../../../../src/application/use-cases/get-or-create-case-report.use-case';

describe('CasesController', () => {
  let controller: CasesController;
  let getCaseByIdUseCase: jest.Mocked<GetCaseByIdUseCase>;
  let listCaseReportsUseCase: jest.Mocked<ListCaseReportsUseCase>;
  let getCaseReportFileUseCase: jest.Mocked<GetCaseReportFileUseCase>;
  let getOrCreateCaseReportUseCase: jest.Mocked<GetOrCreateCaseReportUseCase>;

  const user = { userId: 'user-1' };

  beforeEach(async () => {
    getCaseByIdUseCase = { execute: jest.fn() };
    listCaseReportsUseCase = { execute: jest.fn() };
    getCaseReportFileUseCase = { execute: jest.fn() };
    getOrCreateCaseReportUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasesController],
      providers: [
        { provide: CreateCaseUseCase, useValue: {} },
        { provide: GetCaseByIdUseCase, useValue: getCaseByIdUseCase },
        { provide: GetCasesHistoryByUserIdUseCase, useValue: {} },
        { provide: UpdateFlowWalletUseCase, useValue: {} },
        { provide: UpdateCaseUseCase, useValue: {} },
        { provide: SoftDeleteFlowUseCase, useValue: {} },
        { provide: SoftDeleteFlowTransactionUseCase, useValue: {} },
        { provide: EditCaseUseCase, useValue: {} },
        { provide: ListCaseReportsUseCase, useValue: listCaseReportsUseCase },
        { provide: GetCaseReportFileUseCase, useValue: getCaseReportFileUseCase },
        { provide: GetOrCreateCaseReportUseCase, useValue: getOrCreateCaseReportUseCase },
      ],
    }).compile();

    controller = module.get(CasesController);
  });

  it('getById delegates to getCaseByIdUseCase', async () => {
    const caseData = { id: 'case-1', name: 'Caso', status: 'OPEN', seeds: [], flows: [], mapping: { roots: [], connections: [] } } as Awaited<ReturnType<GetCaseByIdUseCase['execute']>>;
    getCaseByIdUseCase.execute.mockResolvedValue(caseData);

    const result = await controller.getById('case-1', user);

    expect(getCaseByIdUseCase.execute).toHaveBeenCalledWith('case-1', 'user-1');
    expect(result.id).toBe('case-1');
  });

  it('listReports delegates to listCaseReportsUseCase', async () => {
    listCaseReportsUseCase.execute.mockResolvedValue([
      { id: 'r1', caseId: 'case-1', format: 'PDF', generatedAt: '2024-01-01', createdAt: '2024-01-01' },
    ]);

    const result = await controller.listReports('case-1', user);

    expect(listCaseReportsUseCase.execute).toHaveBeenCalledWith('case-1', 'user-1');
    expect(result).toHaveLength(1);
  });

  it('getOrCreateReport delegates to getOrCreateCaseReportUseCase', async () => {
    getOrCreateCaseReportUseCase.execute.mockResolvedValue({
      generated: false,
      reports: [{ id: 'r1', caseId: 'case-1', format: 'PDF', generatedAt: '2024-01-01', createdAt: '2024-01-01' }],
    });

    const result = await controller.getOrCreateReport('case-1', user);

    expect(getOrCreateCaseReportUseCase.execute).toHaveBeenCalledWith('case-1', 'user-1');
    expect(result.generated).toBe(false);
  });

  it('getReportFile returns StreamableFile from use case result', async () => {
    getCaseReportFileUseCase.execute.mockResolvedValue({
      body: Buffer.from('pdf'),
      contentType: 'application/pdf',
      fileName: 'relatorio.pdf',
    });

    const result = await controller.getReportFile('case-1', 'report-1', user);

    expect(getCaseReportFileUseCase.execute).toHaveBeenCalledWith('case-1', 'report-1', 'user-1');
    expect(result).toBeInstanceOf(StreamableFile);
  });
});

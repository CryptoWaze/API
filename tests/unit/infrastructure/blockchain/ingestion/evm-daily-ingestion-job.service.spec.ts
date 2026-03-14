import { Test, TestingModule } from '@nestjs/testing';
import { EvmDailyIngestionJobService } from '../../../../../src/infrastructure/blockchain/ingestion/evm-daily-ingestion-job.service';
import { EvmBlockIngestionService } from '../../../../../src/infrastructure/blockchain/ingestion/evm-block-ingestion.service';

describe('EvmDailyIngestionJobService', () => {
  let service: EvmDailyIngestionJobService;
  let blockIngestion: { runForDate: jest.Mock };
  const envRestore: string | undefined = process.env.DAILY_INGESTION_JOB_ENABLED;

  beforeEach(async () => {
    blockIngestion = { runForDate: jest.fn() };
    process.env.DAILY_INGESTION_JOB_ENABLED = 'true';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvmDailyIngestionJobService,
        {
          provide: EvmBlockIngestionService,
          useValue: blockIngestion,
        },
      ],
    }).compile();

    service = module.get(EvmDailyIngestionJobService);
  });

  afterEach(() => {
    process.env.DAILY_INGESTION_JOB_ENABLED = envRestore;
  });

  it('calls runForDate for each ingestion chain when enabled', async () => {
    blockIngestion.runForDate.mockResolvedValue({
      dateIso: '2024-01-15',
      fromBlock: 1,
      toBlock: 100,
      processedBlocks: 100,
      processedTransactions: 500,
      processedLogs: 1000,
      skipped: false,
    });

    await service.handleDailyIngestion();

    expect(blockIngestion.runForDate).toHaveBeenCalled();
    const calls = blockIngestion.runForDate.mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[0][0]).toMatchObject({
      dateIso: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });
});

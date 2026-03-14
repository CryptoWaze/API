import { Test, TestingModule } from '@nestjs/testing';
import { FlowTraceLogWriterService } from '../../../../src/infrastructure/database/flow-trace-log-writer.service';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('FlowTraceLogWriterService', () => {
  let service: FlowTraceLogWriterService;
  let prisma: {
    flowTraceLog: { create: jest.Mock };
    flowTraceLogStep: { createMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      flowTraceLog: { create: jest.fn() },
      flowTraceLogStep: { createMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowTraceLogWriterService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(FlowTraceLogWriterService);
  });

  it('creates log and steps', async () => {
    prisma.flowTraceLog.create.mockResolvedValue({ id: 'log-1' });
    prisma.flowTraceLogStep.createMany.mockResolvedValue({ count: 2 });

    await service.write({
      inputAddress: '0xinput',
      chainSlug: 'eth',
      status: 'SUCCESS',
      endpointAddress: '0xend',
      steps: [
        {
          fromAddress: '0xa',
          toAddress: '0xb',
          transferSymbol: 'ETH',
          transferAmountRaw: '1',
          transferAmountDecimal: 1,
          txHash: '0x1',
        },
        {
          fromAddress: '0xb',
          toAddress: '0xc',
          transferSymbol: 'USDT',
          transferAmountRaw: '100',
          transferAmountDecimal: 100,
          txHash: '0x2',
          outcome: 'SUCCESS',
        },
      ],
    });

    expect(prisma.flowTraceLog.create).toHaveBeenCalledWith({
      data: {
        inputAddress: '0xinput',
        chainSlug: 'eth',
        status: 'SUCCESS',
        endpointAddress: '0xend',
        failureAtAddress: null,
        failureReason: null,
        stepsCount: 2,
      },
    });
    expect(prisma.flowTraceLogStep.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          flowTraceLogId: 'log-1',
          stepIndex: 0,
          fromAddress: '0xa',
          toAddress: '0xb',
          transferSymbol: 'ETH',
          txHash: '0x1',
        }),
        expect.objectContaining({
          stepIndex: 1,
          outcome: 'SUCCESS',
        }),
      ],
    });
  });

  it('does not call createMany when steps is empty', async () => {
    prisma.flowTraceLog.create.mockResolvedValue({ id: 'log-1' });

    await service.write({
      inputAddress: '0x',
      chainSlug: 'eth',
      status: 'FAILURE',
      failureAtAddress: '0xfail',
      failureReason: 'NO_OUTBOUND',
      steps: [],
    });

    expect(prisma.flowTraceLog.create).toHaveBeenCalled();
    expect(prisma.flowTraceLogStep.createMany).not.toHaveBeenCalled();
  });
});

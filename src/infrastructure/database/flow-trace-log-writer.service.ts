import { Injectable } from '@nestjs/common';
import type {
  IFlowTraceLogWriter,
  FlowTraceLogInput,
} from '../../application/ports/flow-trace-log-writer.port';
import { PrismaService } from './prisma.service';

@Injectable()
export class FlowTraceLogWriterService implements IFlowTraceLogWriter {
  constructor(private readonly prisma: PrismaService) {}

  async write(input: FlowTraceLogInput): Promise<void> {
    const { steps, ...logData } = input;
    const log = await this.prisma.flowTraceLog.create({
      data: {
        inputAddress: logData.inputAddress,
        chainSlug: logData.chainSlug,
        status: logData.status,
        endpointAddress: logData.endpointAddress ?? null,
        failureAtAddress: logData.failureAtAddress ?? null,
        failureReason: logData.failureReason ?? null,
        stepsCount: steps.length,
      },
    });
    if (steps.length > 0) {
      await this.prisma.flowTraceLogStep.createMany({
        data: steps.map((s, i) => ({
          flowTraceLogId: log.id,
          stepIndex: i,
          fromAddress: s.fromAddress,
          toAddress: s.toAddress,
          transferSymbol: s.transferSymbol,
          transferAmountRaw: s.transferAmountRaw,
          transferAmountDecimal: String(s.transferAmountDecimal),
          txHash: s.txHash,
        })),
      });
    }
  }
}

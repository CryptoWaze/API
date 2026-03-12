import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class SoftDeleteFlowTransactionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    caseId: string,
    flowId: string,
    transactionId: string,
    userId: string,
  ): Promise<{ id: string; deletedAt: string }> {
    const tx = await this.prisma.flowTransaction.findUnique({
      where: { id: transactionId },
      include: {
        flow: {
          include: {
            case: { select: { id: true, createdByUserId: true } },
          },
        },
      },
    });
    if (!tx || tx.flow.id !== flowId || tx.flow.case.id !== caseId) {
      throw new NotFoundException(
        'Transação não encontrada para este caso/fluxo.',
      );
    }
    if (tx.flow.case.createdByUserId !== userId) {
      throw new ForbiddenException('Só é permitido editar casos próprios.');
    }

    const now = new Date();

    const updated = await this.prisma.flowTransaction.update({
      where: { id: transactionId },
      data: { deletedAt: now },
      select: { id: true, deletedAt: true },
    });

    await this.prisma.flowEdge.updateMany({
      where: {
        flowId,
        deletedAt: null,
        OR: [
          ...(tx.txHash
            ? [
                {
                  txHash: tx.txHash,
                },
              ]
            : []),
          {
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            transferTimestamp: tx.timestamp,
          },
        ],
      },
      data: { deletedAt: now },
    });

    return { id: updated.id, deletedAt: updated.deletedAt!.toISOString() };
  }
}

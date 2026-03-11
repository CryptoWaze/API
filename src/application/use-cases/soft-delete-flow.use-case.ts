import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class SoftDeleteFlowUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    caseId: string,
    flowId: string,
    userId: string,
  ): Promise<{ id: string; deletedAt: string }> {
    const flow = await this.prisma.flow.findUnique({
      where: { id: flowId },
      include: { case: { select: { id: true, createdByUserId: true } } },
    });
    if (!flow || flow.case.id !== caseId) {
      throw new NotFoundException('Fluxo não encontrado para este caso.');
    }
    if (flow.case.createdByUserId !== userId) {
      throw new ForbiddenException('Só é permitido editar casos próprios.');
    }

    const now = new Date();
    const updated = await this.prisma.flow.update({
      where: { id: flowId },
      data: {
        deletedAt: now,
        transactions: {
          updateMany: {
            where: { deletedAt: null },
            data: { deletedAt: now },
          },
        },
        edges: {
          updateMany: {
            where: { deletedAt: null },
            data: { deletedAt: now },
          },
        },
      },
      select: { id: true, deletedAt: true },
    });

    return { id: updated.id, deletedAt: updated.deletedAt!.toISOString() };
  }
}


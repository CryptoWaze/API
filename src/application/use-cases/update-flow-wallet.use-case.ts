import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { UpdateFlowWalletInput } from '../schemas/update-flow-wallet.schema';

@Injectable()
export class UpdateFlowWalletUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    caseId: string,
    walletId: string,
    userId: string,
    input: UpdateFlowWalletInput,
  ): Promise<{ id: string; nickname: string | null; position: unknown }> {
    const wallet = await this.prisma.flowWallet.findUnique({
      where: { id: walletId },
      include: {
        flow: {
          include: {
            case: { select: { id: true, createdByUserId: true } },
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira do fluxo não encontrada.');
    }
    if (wallet.flow.case.id !== caseId) {
      throw new NotFoundException('Carteira do fluxo não encontrada.');
    }
    if (wallet.flow.case.createdByUserId !== userId) {
      throw new ForbiddenException(
        'Só é permitido editar carteiras de casos próprios.',
      );
    }

    const data: { nickname?: string | null; position?: string | object } = {};
    if (input.nickname !== undefined) data.nickname = input.nickname;
    if (input.position !== undefined) data.position = input.position;

    const updated = await this.prisma.flowWallet.update({
      where: { id: walletId },
      data,
    });

    const positionOut =
      updated.position == null || updated.position === 'default'
        ? 'default'
        : typeof updated.position === 'object' &&
            updated.position !== null &&
            'x' in updated.position &&
            'y' in updated.position
          ? {
              x: (updated.position as { x: number }).x,
              y: (updated.position as { y: number }).y,
            }
          : 'default';

    return {
      id: updated.id,
      nickname: updated.nickname,
      position: positionOut,
    };
  }
}

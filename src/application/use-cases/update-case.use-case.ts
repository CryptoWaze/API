import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { UpdateCaseInput } from '../schemas/update-case.schema';

@Injectable()
export class UpdateCaseUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    caseId: string,
    userId: string,
    input: UpdateCaseInput,
  ): Promise<{ id: string; name: string }> {
    const existing = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, name: true, createdByUserId: true },
    });
    if (!existing) {
      throw new NotFoundException('Caso não encontrado.');
    }
    if (existing.createdByUserId !== userId) {
      throw new ForbiddenException('Só é permitido editar casos próprios.');
    }

    const data: { name?: string } = {};
    if (input.name !== undefined) data.name = input.name;
    if (Object.keys(data).length === 0) {
      return { id: existing.id, name: existing.name };
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data,
      select: { id: true, name: true },
    });
    return updated;
  }
}


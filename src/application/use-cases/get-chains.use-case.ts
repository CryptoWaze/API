import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type ChainItem = {
  slug: string;
  name: string | null;
  iconUrl: string | null;
};

@Injectable()
export class GetChainsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ChainItem[]> {
    const chains = await this.prisma.chain.findMany({
      orderBy: { slug: 'asc' },
      select: { slug: true, name: true, iconUrl: true },
    });
    return chains.map((c) => ({
      slug: c.slug,
      name: c.name,
      iconUrl: c.iconUrl,
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const TOP_LIMIT = 100;

export type TopTokenItem = {
  symbol: string;
  name: string | null;
  imageUrl: string | null;
};

@Injectable()
export class GetTopTokensUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<TopTokenItem[]> {
    const tokens = await this.prisma.token.findMany({
      orderBy: { marketCapRank: 'asc' },
      take: TOP_LIMIT,
      select: { symbol: true, name: true, imageUrl: true },
    });
    return tokens.map((t) => ({
      symbol: t.symbol,
      name: t.name,
      imageUrl: t.imageUrl,
    }));
  }
}

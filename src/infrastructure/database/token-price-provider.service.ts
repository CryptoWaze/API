import { Injectable } from '@nestjs/common';
import type {
  ITokenPriceProvider,
  TokenInfo,
} from '../../application/ports/token-price-provider.port';
import { PrismaService } from './prisma.service';

@Injectable()
export class TokenPriceProviderService implements ITokenPriceProvider {
  constructor(private readonly prisma: PrismaService) {}

  async getPriceInUsd(symbol: string): Promise<number | null> {
    const map = await this.getTokenInfoBatch([symbol]);
    const key = symbol.trim().toLowerCase();
    return map.get(key)?.priceUsd ?? null;
  }

  async getTokenInfoBatch(symbols: string[]): Promise<Map<string, TokenInfo>> {
    const normalized = [...new Set(symbols.map((s) => s.trim().toLowerCase()))];
    if (normalized.length === 0) return new Map();
    const tokens = await this.prisma.token.findMany({
      where: { symbol: { in: normalized } },
      select: { symbol: true, currentPrice: true, imageUrl: true },
    });
    const map = new Map<string, TokenInfo>();
    for (const sym of normalized) {
      const token = tokens.find((t) => t.symbol === sym);
      const priceUsd =
        token?.currentPrice != null && token.currentPrice !== ''
          ? Number.parseFloat(token.currentPrice)
          : null;
      map.set(sym, {
        priceUsd:
          priceUsd != null && !Number.isNaN(priceUsd) ? priceUsd : null,
        imageUrl: token?.imageUrl ?? null,
      });
    }
    return map;
  }
}

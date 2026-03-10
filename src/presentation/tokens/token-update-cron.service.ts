import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CoingeckoApiService } from '../../infrastructure/coingecko/coingecko-api.service';
import type { CoinGeckoMarketItem } from '../../infrastructure/coingecko/coingecko-api.types';

const PAGES_TOTAL = 8;
const DELAY_MS = 6000;
const RUN_ON_STARTUP_DELAY_MS = 5000;
const RATE_LIMIT_WAIT_MS = 65_000;
const RATE_LIMIT_RETRIES = 2;

function numToString(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return String(value);
}

function parseLastUpdated(s: string | null | undefined): Date | null {
  if (s == null || s === '') return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

@Injectable()
export class TokenUpdateCronService implements OnModuleInit {
  private readonly logger = new Logger(TokenUpdateCronService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly coingeckoApi: CoingeckoApiService,
  ) {}

  onModuleInit(): void {
    this.logger.log(
      `Primeira atualização de tokens agendada em ${RUN_ON_STARTUP_DELAY_MS / 1000}s.`,
    );
    setTimeout(() => {
      void this.handleTokenUpdate();
    }, RUN_ON_STARTUP_DELAY_MS);
  }

  @Cron('*/10 * * * *')
  async handleTokenUpdate(): Promise<void> {
    if (this.running) {
      this.logger.warn('Token update skipped: previous run still in progress.');
      return;
    }
    this.running = true;
    try {
      await this.runUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Token update failed (API continua rodando): ${message}`);
    } finally {
      this.running = false;
    }
  }

  private async runUpdate(): Promise<void> {
    let totalUpserted = 0;
    for (let page = 1; page <= PAGES_TOTAL; page++) {
      const isRateLimit = (e: unknown) =>
        String(e).includes('429') || String(e).includes('Too Many Requests');
      let items: Awaited<ReturnType<CoingeckoApiService['getMarketsPage']>> = [];
      for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
        try {
          items = await this.coingeckoApi.getMarketsPage(page);
          break;
        } catch (err) {
          if (attempt < RATE_LIMIT_RETRIES && isRateLimit(err)) {
            this.logger.warn(
              `Rate limit (429) na página ${page}. Aguardando ${RATE_LIMIT_WAIT_MS / 1000}s para tentar novamente (${attempt + 1}/${RATE_LIMIT_RETRIES}).`,
            );
            await this.delay(RATE_LIMIT_WAIT_MS);
          } else {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`Token update page ${page} failed: ${message}`);
            this.logger.log(
              `Token update interrompido. ${totalUpserted} tokens salvos até agora. Próxima execução em 10 min.`,
            );
            return;
          }
        }
      }
      if (items.length === 0) break;
      for (const item of items) {
        await this.upsertToken(item);
        totalUpserted++;
      }
      if (page < PAGES_TOTAL) {
        await this.delay(DELAY_MS);
      }
    }
    this.logger.log(`Token update completed. Upserted ${totalUpserted} tokens.`);
  }

  private async upsertToken(item: CoinGeckoMarketItem): Promise<void> {
    const lastUpdatedAt = parseLastUpdated(item.last_updated);
    await this.prisma.token.upsert({
      where: { coingeckoId: item.id },
      create: {
        coingeckoId: item.id,
        name: item.name,
        symbol: item.symbol.toLowerCase(),
        imageUrl: item.image ?? null,
        currentPrice: numToString(item.current_price),
        marketCap: numToString(item.market_cap),
        marketCapRank: item.market_cap_rank ?? null,
        totalVolume: numToString(item.total_volume),
        lastUpdatedAt,
      },
      update: {
        name: item.name,
        symbol: item.symbol.toLowerCase(),
        imageUrl: item.image ?? null,
        currentPrice: numToString(item.current_price),
        marketCap: numToString(item.market_cap),
        marketCapRank: item.market_cap_rank ?? null,
        totalVolume: numToString(item.total_volume),
        lastUpdatedAt,
      },
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

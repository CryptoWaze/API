import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClickHouseClient } from '../../infrastructure/blockchain/clickhouse/clickhouse.client';
import { CoingeckoApiService } from '../../infrastructure/coingecko/coingecko-api.service';
import type { CoinGeckoMarketItem } from '../../infrastructure/coingecko/coingecko-api.types';

const PAGES_TOTAL = 20;
const DELAY_MS = 6000;
const RUN_ON_STARTUP_DELAY_MS = 5000;
const RATE_LIMIT_WAIT_MS = 65_000;
const RATE_LIMIT_RETRIES = 2;

function escapeString(value: string | null | undefined): string {
  if (value == null) return '';
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function toClickHouseDateTime(d: Date | null | undefined): string {
  if (!d) return 'toDateTime64(\'1970-01-01 00:00:00\', 3, \'UTC\')';
  return `parseDateTime64BestEffort('${d.toISOString()}', 3, 'UTC')`;
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
  private readonly enabled: boolean;

  constructor(
    private readonly clickhouse: ClickHouseClient,
    private readonly coingeckoApi: CoingeckoApiService,
  ) {
    this.enabled = process.env.TOKEN_UPDATE_CRON_ENABLED === 'true';
  }

  onModuleInit(): void {
    if (!this.enabled) {
      this.logger.log('Token update cron pausado. Definir TOKEN_UPDATE_CRON_ENABLED=true para ativar.');
      return;
    }
    this.logger.log(
      `Primeira atualização de tokens agendada em ${RUN_ON_STARTUP_DELAY_MS / 1000}s.`,
    );
    setTimeout(() => {
      void this.handleTokenUpdate();
    }, RUN_ON_STARTUP_DELAY_MS);
  }

  @Cron('*/10 * * * *')
  async handleTokenUpdate(): Promise<void> {
    if (!this.enabled) return;
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
    const allItems: CoinGeckoMarketItem[] = [];
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
              `Token update interrompido. ${allItems.length} tokens coletados até agora. Próxima execução em 10 min.`,
            );
            return;
          }
        }
      }
      if (items.length === 0) break;
      allItems.push(...items);
      if (page < PAGES_TOTAL) {
        await this.delay(DELAY_MS);
      }
    }

    if (allItems.length === 0) {
      this.logger.log('Token update completed. Nenhum token para gravar.');
      return;
    }

    await this.writeToClickHouse(allItems);
    this.logger.log(`Token update completed. Gravados ${allItems.length} tokens no ClickHouse.`);
  }

  private async writeToClickHouse(items: CoinGeckoMarketItem[]): Promise<void> {
    await this.clickhouse.exec(`
      CREATE DATABASE IF NOT EXISTS blockchain_data
    `);
    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.tokens
      (
          symbol String,
          contract_address Nullable(String),
          chain_slug String,
          name String,
          decimals UInt8,
          image_url Nullable(String),
          current_price_usd Nullable(Decimal(38, 8)),
          market_cap Nullable(Decimal(38, 8)),
          market_cap_rank Nullable(Int32),
          total_volume Nullable(Decimal(38, 8)),
          last_updated_at Nullable(DateTime64(3, 'UTC')),
          created_at DateTime64(3, 'UTC'),
          updated_at DateTime64(3, 'UTC')
      )
      ENGINE = MergeTree
      ORDER BY (chain_slug, symbol)
      SETTINGS index_granularity = 8192
    `);
    await this.clickhouse.exec(`TRUNCATE TABLE IF EXISTS blockchain_data.tokens`);

    const now = new Date();
    const batchSize = 500;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const values = batch
        .map((item) => {
          const symbol = (item.symbol ?? '').toLowerCase();
          const lastUpdatedAt = parseLastUpdated(item.last_updated);
          return `('${escapeString(symbol)}',NULL,'','${escapeString(item.name)}',18,${item.image ? `'${escapeString(item.image)}'` : 'NULL'},${item.current_price ?? 'NULL'},${item.market_cap ?? 'NULL'},${item.market_cap_rank ?? 'NULL'},${item.total_volume ?? 'NULL'},${lastUpdatedAt ? toClickHouseDateTime(lastUpdatedAt) : 'NULL'},${toClickHouseDateTime(now)},${toClickHouseDateTime(now)})`;
        })
        .join(',\n    ');

      await this.clickhouse.exec(`
INSERT INTO blockchain_data.tokens
  (symbol, contract_address, chain_slug, name, decimals, image_url, current_price_usd, market_cap, market_cap_rank, total_volume, last_updated_at, created_at, updated_at)
VALUES
  ${values}
`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ClickHouseClient } from '../clickhouse/clickhouse.client';
import { PrismaService } from '../../database/prisma.service';

function escapeString(value: string | null | undefined): string {
  if (value == null) return '';
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function toClickHouseDateTime(d: Date | null | undefined): string {
  if (!d) return 'toDateTime64(\'1970-01-01 00:00:00\', 3, \'UTC\')';
  return `parseDateTime64BestEffort('${d.toISOString()}', 3, 'UTC')`;
}

@Injectable()
export class CatalogSyncService {
  private readonly logger = new Logger(CatalogSyncService.name);

  constructor(
    private readonly clickhouse: ClickHouseClient,
    private readonly prisma: PrismaService,
  ) {}

  async syncAll(): Promise<{ exchanges: number; hotWallets: number; tokens: number }> {
    const exchanges = await this.syncExchanges();
    const hotWallets = await this.syncHotWallets();
    const tokens = await this.syncTokens();
    return { exchanges, hotWallets, tokens };
  }

  async syncTokens(): Promise<number> {
    let existingCount = 0;
    try {
      const countResult = await this.clickhouse.query<{ count: string }>(
        `SELECT count() AS count FROM blockchain_data.tokens`,
      );
      existingCount = parseInt(countResult[0]?.count ?? '0', 10);
    } catch {
      existingCount = 0;
    }
    if (existingCount > 0) {
      this.logger.debug(
        `Tabela tokens já populada (${existingCount} linhas). Cron mantém atualizado.`,
      );
      return existingCount;
    }

    const tokens = await this.prisma.token.findMany({
      select: {
        symbol: true,
        name: true,
        imageUrl: true,
        currentPrice: true,
        marketCap: true,
        marketCapRank: true,
        totalVolume: true,
        lastUpdatedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (tokens.length === 0) {
      this.logger.debug('Nenhum token no Postgres para sincronizar.');
      return 0;
    }

    const batchSize = 500;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const values = batch
        .map((t) => {
          const price = t.currentPrice ? parseFloat(t.currentPrice) : null;
          const marketCap = t.marketCap ? parseFloat(t.marketCap) : null;
          const totalVolume = t.totalVolume ? parseFloat(t.totalVolume) : null;
          return `('${escapeString(t.symbol)}',NULL,'','${escapeString(t.name)}',18,${t.imageUrl ? `'${escapeString(t.imageUrl)}'` : 'NULL'},${price ?? 'NULL'},${marketCap ?? 'NULL'},${t.marketCapRank ?? 'NULL'},${totalVolume ?? 'NULL'},${t.lastUpdatedAt ? toClickHouseDateTime(t.lastUpdatedAt) : 'NULL'},${toClickHouseDateTime(t.createdAt)},${toClickHouseDateTime(t.updatedAt)})`;
        })
        .join(',\n    ');

      await this.clickhouse.exec(`
INSERT INTO blockchain_data.tokens
  (symbol, contract_address, chain_slug, name, decimals, image_url, current_price_usd, market_cap, market_cap_rank, total_volume, last_updated_at, created_at, updated_at)
VALUES
  ${values}
`);
    }

    this.logger.log(`Sincronizados ${tokens.length} tokens do Postgres para o ClickHouse.`);
    return tokens.length;
  }

  async syncHotWallets(): Promise<number> {
    const hotWallets = await this.prisma.hotWallet.findMany({
      include: { exchange: true, chain: true },
    });

    if (hotWallets.length === 0) {
      this.logger.debug('Nenhuma hot wallet no Postgres para sincronizar.');
      return 0;
    }

    await this.clickhouse.exec(
      `TRUNCATE TABLE IF EXISTS blockchain_data.hot_wallets`,
    );

    const values = hotWallets
      .map(
        (h) =>
          `('${h.id}','${escapeString(h.exchange.slug)}','${escapeString(h.chain.slug)}','${escapeString(h.address)}',${h.label ? `'${escapeString(h.label)}'` : 'NULL'},${h.isActive ? 1 : 0},${toClickHouseDateTime(h.createdAt)},${toClickHouseDateTime(h.updatedAt)})`,
      )
      .join(',\n    ');

    await this.clickhouse.exec(`
INSERT INTO blockchain_data.hot_wallets
  (id, exchange_slug, chain_slug, address, label, is_active, created_at, updated_at)
VALUES
  ${values}
`);

    this.logger.log(
      `Sincronizadas ${hotWallets.length} hot wallets do Postgres para o ClickHouse.`,
    );
    return hotWallets.length;
  }

  async syncExchanges(): Promise<number> {
    const exchanges = await this.prisma.exchange.findMany({
      select: { slug: true, name: true, iconUrl: true, createdAt: true, updatedAt: true },
    });

    if (exchanges.length === 0) {
      this.logger.debug('Nenhuma exchange no Postgres para sincronizar.');
      return 0;
    }

    await this.clickhouse.exec(
      `TRUNCATE TABLE IF EXISTS blockchain_data.exchanges`,
    );

    const values = exchanges
      .map(
        (e) =>
          `('${escapeString(e.slug)}','${escapeString(e.name)}',${e.iconUrl ? `'${escapeString(e.iconUrl)}'` : 'NULL'},${toClickHouseDateTime(e.createdAt)},${toClickHouseDateTime(e.updatedAt)})`,
      )
      .join(',\n    ');

    await this.clickhouse.exec(`
INSERT INTO blockchain_data.exchanges
  (slug, name, icon_url, created_at, updated_at)
VALUES
  ${values}
`);

    this.logger.log(
      `Sincronizadas ${exchanges.length} exchanges do Postgres para o ClickHouse.`,
    );
    return exchanges.length;
  }
}

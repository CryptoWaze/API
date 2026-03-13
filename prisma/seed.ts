import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { CHAINS } from './seeds/chains';
import {
  BINANCE_EXCHANGE,
  BINANCE_HOT_WALLETS_BY_CHAIN,
} from './seeds/binance-hot-wallets';
import {
  GATE_EXCHANGE,
  GATE_HOT_WALLETS_BY_CHAIN,
} from './seeds/gate-hot-wallets';
import {
  COINBASE_EXCHANGE,
  COINBASE_HOT_WALLETS_BY_CHAIN,
} from './seeds/coinbase-hot-wallets';
import {
  UPBIT_EXCHANGE,
  UPBIT_HOT_WALLETS_BY_CHAIN,
} from './seeds/upbit-hot-wallets';
import {
  OKX_EXCHANGE,
  OKX_HOT_WALLETS_BY_CHAIN,
} from './seeds/okx-hot-wallets';
import {
  BYBIT_EXCHANGE,
  BYBIT_HOT_WALLETS_BY_CHAIN,
} from './seeds/bybit-hot-wallets';
import {
  BITGET_EXCHANGE,
  BITGET_HOT_WALLETS_BY_CHAIN,
} from './seeds/bitget-hot-wallets';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function normalizeAddress(addr: string): string {
  return addr.trim();
}

function addressKey(addr: string): string {
  const a = addr.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

async function processAddressList(
  addresses: string[],
  exchangeId: string,
  chainId: string,
): Promise<{ created: number; skipped: number }> {
  const raw = addresses.map(normalizeAddress).filter((a) => a.length > 0);
  const uniqueByKey = new Map<string, string>();
  for (const a of raw) {
    const key = addressKey(a);
    if (!uniqueByKey.has(key)) uniqueByKey.set(key, a);
  }
  let created = 0;
  let skipped = 0;
  for (const address of Array.from(uniqueByKey.values())) {
    const key = addressKey(address);
    const existing = await prisma.hotWallet.findFirst({
      where: {
        exchangeId,
        chainId,
        address: key,
      },
    });
    if (existing) {
      skipped += 1;
      continue;
    }
    await prisma.hotWallet.create({
      data: {
        exchangeId,
        chainId,
        address: key,
      },
    });
    created += 1;
  }
  return { created, skipped };
}

async function main() {
  const chainIdsBySlug = new Map<string, string>();
  for (const { slug, name, iconUrl } of CHAINS) {
    const chain = await prisma.chain.upsert({
      where: { slug },
      create: { slug, name, iconUrl: iconUrl ?? null },
      update: { name, iconUrl: iconUrl ?? null },
    });
    chainIdsBySlug.set(chain.slug, chain.id);
  }

  const binanceExchange = await prisma.exchange.upsert({
    where: { slug: BINANCE_EXCHANGE.slug },
    create: {
      name: BINANCE_EXCHANGE.name,
      slug: BINANCE_EXCHANGE.slug,
      iconUrl: BINANCE_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: BINANCE_EXCHANGE.name,
      iconUrl: BINANCE_EXCHANGE.iconUrl ?? null,
    },
  });

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    BINANCE_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      binanceExchange.id,
      chainId,
    );
    totalCreated += result.created;
    totalSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Binance hot wallets: ${totalCreated} created, ${totalSkipped} already existed.`,
    );
  }

  const gateExchange = await prisma.exchange.upsert({
    where: { slug: GATE_EXCHANGE.slug },
    create: {
      name: GATE_EXCHANGE.name,
      slug: GATE_EXCHANGE.slug,
      iconUrl: GATE_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: GATE_EXCHANGE.name,
      iconUrl: GATE_EXCHANGE.iconUrl ?? null,
    },
  });

  let gateCreated = 0;
  let gateSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    GATE_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      gateExchange.id,
      chainId,
    );
    gateCreated += result.created;
    gateSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Gate hot wallets: ${gateCreated} created, ${gateSkipped} already existed.`,
    );
  }

  const coinbaseExchange = await prisma.exchange.upsert({
    where: { slug: COINBASE_EXCHANGE.slug },
    create: {
      name: COINBASE_EXCHANGE.name,
      slug: COINBASE_EXCHANGE.slug,
      iconUrl: COINBASE_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: COINBASE_EXCHANGE.name,
      iconUrl: COINBASE_EXCHANGE.iconUrl ?? null,
    },
  });

  let coinbaseCreated = 0;
  let coinbaseSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    COINBASE_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      coinbaseExchange.id,
      chainId,
    );
    coinbaseCreated += result.created;
    coinbaseSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Coinbase hot wallets: ${coinbaseCreated} created, ${coinbaseSkipped} already existed.`,
    );
  }

  const upbitExchange = await prisma.exchange.upsert({
    where: { slug: UPBIT_EXCHANGE.slug },
    create: {
      name: UPBIT_EXCHANGE.name,
      slug: UPBIT_EXCHANGE.slug,
      iconUrl: UPBIT_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: UPBIT_EXCHANGE.name,
      iconUrl: UPBIT_EXCHANGE.iconUrl ?? null,
    },
  });

  let upbitCreated = 0;
  let upbitSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    UPBIT_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      upbitExchange.id,
      chainId,
    );
    upbitCreated += result.created;
    upbitSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Upbit hot wallets: ${upbitCreated} created, ${upbitSkipped} already existed.`,
    );
  }

  const okxExchange = await prisma.exchange.upsert({
    where: { slug: OKX_EXCHANGE.slug },
    create: {
      name: OKX_EXCHANGE.name,
      slug: OKX_EXCHANGE.slug,
      iconUrl: OKX_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: OKX_EXCHANGE.name,
      iconUrl: OKX_EXCHANGE.iconUrl ?? null,
    },
  });

  let okxCreated = 0;
  let okxSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    OKX_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      okxExchange.id,
      chainId,
    );
    okxCreated += result.created;
    okxSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: OKX hot wallets: ${okxCreated} created, ${okxSkipped} already existed.`,
    );
  }

  const bybitExchange = await prisma.exchange.upsert({
    where: { slug: BYBIT_EXCHANGE.slug },
    create: {
      name: BYBIT_EXCHANGE.name,
      slug: BYBIT_EXCHANGE.slug,
      iconUrl: BYBIT_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: BYBIT_EXCHANGE.name,
      iconUrl: BYBIT_EXCHANGE.iconUrl ?? null,
    },
  });

  let bybitCreated = 0;
  let bybitSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    BYBIT_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      bybitExchange.id,
      chainId,
    );
    bybitCreated += result.created;
    bybitSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Bybit hot wallets: ${bybitCreated} created, ${bybitSkipped} already existed.`,
    );
  }

  const bitgetExchange = await prisma.exchange.upsert({
    where: { slug: BITGET_EXCHANGE.slug },
    create: {
      name: BITGET_EXCHANGE.name,
      slug: BITGET_EXCHANGE.slug,
      iconUrl: BITGET_EXCHANGE.iconUrl ?? null,
    },
    update: {
      name: BITGET_EXCHANGE.name,
      iconUrl: BITGET_EXCHANGE.iconUrl ?? null,
    },
  });

  let bitgetCreated = 0;
  let bitgetSkipped = 0;

  for (const [chainSlug, addresses] of Object.entries(
    BITGET_HOT_WALLETS_BY_CHAIN,
  )) {
    const chainId = chainIdsBySlug.get(chainSlug);
    if (!chainId) {
      throw new Error(
        `Chain slug "${chainSlug}" not found. Add it to prisma/seeds/chains.ts.`,
      );
    }
    const result = await processAddressList(
      addresses,
      bitgetExchange.id,
      chainId,
    );
    bitgetCreated += result.created;
    bitgetSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: Bitget hot wallets: ${bitgetCreated} created, ${bitgetSkipped} already existed.`,
    );
  }
}

void main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });

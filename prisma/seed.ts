import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { CHAINS } from './seeds/chains';
import {
  BINANCE_EXCHANGE,
  BINANCE_HOT_WALLETS_BY_CHAIN,
} from './seeds/binance-hot-wallets';

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

  const exchange = await prisma.exchange.upsert({
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
      exchange.id,
      chainId,
    );
    totalCreated += result.created;
    totalSkipped += result.skipped;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Seed: chains upserted; Binance hot wallets: ${totalCreated} created, ${totalSkipped} already existed.`,
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

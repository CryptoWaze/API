import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DELAY_MS = 350;
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;
const DEFAULT_MIME = 'image/png';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mimeToDataUrlPrefix(mime: string): string {
  const normalized = mime.split(';')[0].trim().toLowerCase();
  if (normalized.startsWith('image/')) return `data:${normalized};base64,`;
  return `data:${DEFAULT_MIME};base64,`;
}

type FetchResult =
  | { ok: true; dataUrl: string }
  | { ok: false; reason: string };

async function fetchImageAsDataUrl(url: string): Promise<FetchResult> {
  const opts = {
    signal: AbortSignal.timeout(20_000),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TokenImageSync/1.0)' },
  };
  let lastReason = '';
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        const reason = `${res.status} ${res.statusText}`;
        if (res.status === 429 && attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY_MS);
          continue;
        }
        return { ok: false, reason };
      }
      const buf = await res.arrayBuffer();
      const base64 = Buffer.from(buf).toString('base64');
      const contentType = res.headers.get('content-type') ?? DEFAULT_MIME;
      return {
        ok: true,
        dataUrl: mimeToDataUrlPrefix(contentType) + base64,
      };
    } catch (e) {
      lastReason = e instanceof Error ? e.message : String(e);
      if (attempt < MAX_RETRIES) await delay(RETRY_DELAY_MS);
    }
  }
  return { ok: false, reason: lastReason || 'unknown' };
}

async function main() {
  const tokens = await prisma.token.findMany({
    where: { imageUrl: { not: null }, imageBase64: null },
    select: { id: true, symbol: true, imageUrl: true },
  });

  let ok = 0;
  const failures: { symbol: string; reason: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const url = t.imageUrl!;
    const result = await fetchImageAsDataUrl(url);
    if (result.ok) {
      await prisma.token.update({
        where: { id: t.id },
        data: { imageBase64: result.dataUrl },
      });
      ok++;
    } else {
      failures.push({ symbol: t.symbol, reason: result.reason });
    }
    if (i < tokens.length - 1) await delay(DELAY_MS);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Token images: ${ok} converted to base64, ${failures.length} failed (total ${tokens.length}).`,
    );
    if (failures.length > 0) {
      console.log('Falhas (symbol -> motivo):');
      for (const f of failures) {
        console.log(`  ${f.symbol}: ${f.reason}`);
      }
    }
  }
}

void main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });

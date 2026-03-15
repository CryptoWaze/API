import 'dotenv/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const TOP_LIMIT = 500;
const DELAY_MS = 350;
const FETCH_TIMEOUT_MS = 20_000;
const WEBP_QUALITY = 85;
const R2_KEY_PREFIX = 'tokens/';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createS3Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    accountId != null && accountId !== ''
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : process.env.R2_ENDPOINT ?? '';
  return new S3Client({
    region: process.env.R2_REGION ?? 'auto',
    endpoint,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
    forcePathStyle: true,
  });
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TokenImageSync/1.0)' },
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch {
    return null;
  }
}

async function toWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

type UploadResult =
  | { ok: true; key: string }
  | { ok: false; reason: string };

async function uploadToR2(
  client: S3Client,
  bucket: string,
  key: string,
  body: Buffer,
): Promise<UploadResult> {
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'image/webp',
      }),
    );
    return { ok: true, key };
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    return { ok: false, reason };
  }
}

function buildPublicUrl(baseUrl: string, key: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}/${key}`;
}

async function main() {
  const bucket = process.env.R2_BUCKET ?? 'reports';
  const publicBaseUrl = process.env.R2_PUBLIC_URL ?? '';

  const tokens = await prisma.token.findMany({
    where: { imageUrl: { not: null } },
    orderBy: { marketCapRank: 'asc' },
    take: TOP_LIMIT,
    select: {
      id: true,
      coingeckoId: true,
      symbol: true,
      imageUrl: true,
      imageR2Url: true,
    },
  });

  const client = createS3Client();
  let ok = 0;
  const failures: { symbol: string; reason: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.imageR2Url) continue;
    const url = t.imageUrl!;
    const key = `${R2_KEY_PREFIX}${t.coingeckoId}.webp`;

    const raw = await fetchImageBuffer(url);
    if (!raw) {
      failures.push({ symbol: t.symbol, reason: 'fetch failed' });
      if (i < tokens.length - 1) await delay(DELAY_MS);
      continue;
    }

    let webp: Buffer;
    try {
      webp = await toWebp(raw);
    } catch (e) {
      failures.push({
        symbol: t.symbol,
        reason: e instanceof Error ? e.message : 'webp conversion failed',
      });
      if (i < tokens.length - 1) await delay(DELAY_MS);
      continue;
    }

    const upload = await uploadToR2(client, bucket, key, webp);
    if (!upload.ok) {
      failures.push({ symbol: t.symbol, reason: upload.reason });
      if (i < tokens.length - 1) await delay(DELAY_MS);
      continue;
    }

    const imageR2Url =
      publicBaseUrl !== '' ? buildPublicUrl(publicBaseUrl, key) : null;
    if (imageR2Url) {
      await prisma.token.update({
        where: { id: t.id },
        data: { imageR2Url },
      });
    }
    ok++;

    if (i < tokens.length - 1) await delay(DELAY_MS);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Token images: ${ok} uploaded to R2 (WebP), ${failures.length} failed (total ${tokens.length}).`,
    );
    if (publicBaseUrl === '') {
      console.log(
        'R2_PUBLIC_URL não definido: URLs não foram salvas em imageR2Url.',
      );
    }
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

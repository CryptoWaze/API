import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const R2_KEY_PREFIX = 'tokens/';

function buildPublicUrl(baseUrl: string, key: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}/${key}`;
}

async function main() {
  const publicBaseUrl = process.env.R2_PUBLIC_URL ?? '';
  if (publicBaseUrl === '') {
    console.error('Defina R2_PUBLIC_URL no .env (ex: https://pub-xxx.r2.dev)');
    process.exit(1);
  }

  const tokens = await prisma.token.findMany({
    where: { imageR2Url: null },
    select: { id: true, coingeckoId: true },
  });

  let updated = 0;
  for (const t of tokens) {
    const key = `${R2_KEY_PREFIX}${t.coingeckoId}.webp`;
    const imageR2Url = buildPublicUrl(publicBaseUrl, key);
    await prisma.token.update({
      where: { id: t.id },
      data: { imageR2Url },
    });
    updated++;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `imageR2Url preenchido para ${updated} tokens (base: ${publicBaseUrl}).`,
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

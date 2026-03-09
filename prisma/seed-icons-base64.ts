import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DATA_URL_PREFIX = 'data:image/svg+xml;base64,';

function svgToDataUrl(filePath: string): string {
  const buffer = readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return DATA_URL_PREFIX + base64;
}

async function main() {
  const projectRoot = join(__dirname, '..');
  const ethPath = join(projectRoot, 'eth-logo.svg');
  const bnbPath = join(projectRoot, 'bnb-logo.svg');
  const binancePath = join(projectRoot, 'b-logo.svg');

  const ethDataUrl = svgToDataUrl(ethPath);
  const bnbDataUrl = svgToDataUrl(bnbPath);
  const binanceDataUrl = svgToDataUrl(binancePath);

  await prisma.chain.updateMany({
    where: { slug: 'eth' },
    data: { iconUrl: ethDataUrl },
  });
  await prisma.chain.updateMany({
    where: { slug: 'bsc' },
    data: { iconUrl: bnbDataUrl },
  });
  await prisma.exchange.updateMany({
    where: { slug: 'binance' },
    data: { iconUrl: binanceDataUrl },
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Ícones em base64 atualizados: Chain eth, Chain bsc, Exchange binance.',
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

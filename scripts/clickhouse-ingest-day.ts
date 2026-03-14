import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EvmBlockIngestionService } from '../src/infrastructure/blockchain/ingestion/evm-block-ingestion.service';

const CHAIN = (process.env.INGEST_CHAIN ?? 'eth-mainnet') as
  | 'eth-mainnet'
  | 'polygon-mainnet'
  | 'base-mainnet'
  | 'bnb-mainnet';
const DATE_ISO = process.env.INGEST_DATE ?? (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
})();

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ingestion = app.get(EvmBlockIngestionService);
  const result = await ingestion.runForDate({
    chain: CHAIN,
    dateIso: DATE_ISO,
  });
  console.log('Job diário (runForDate) concluído:', result);
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

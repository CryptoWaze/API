import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EvmBlockIngestionService } from '../src/infrastructure/blockchain/ingestion/evm-block-ingestion.service';

const CHAIN = (process.env.INGEST_CHAIN ?? 'eth-mainnet') as
  | 'eth-mainnet'
  | 'polygon-mainnet'
  | 'base-mainnet'
  | 'bnb-mainnet';
const START_TIMESTAMP = process.env.INGEST_START_TIMESTAMP ?? '2025-01-01T00:00:00.000Z';
const MAX_BLOCKS = parseInt(process.env.INGEST_MAX_BLOCKS ?? '100', 10);

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const ingestion = app.get(EvmBlockIngestionService);
  const result = await ingestion.runOnce({
    chain: CHAIN,
    startTimestampIso: START_TIMESTAMP,
    maxBlocksPerRun: MAX_BLOCKS,
  });
  console.log('Ingestão concluída:', result);
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CatalogSyncService } from '../src/infrastructure/blockchain/ingestion/catalog-sync.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const catalogSync = app.get(CatalogSyncService);
  const result = await catalogSync.syncAll();
  console.log('Sincronização concluída:', result);
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

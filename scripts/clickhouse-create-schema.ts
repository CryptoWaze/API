import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EvmSchemaRepository } from '../src/infrastructure/blockchain/ingestion/evm-schema.repository';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const schemaRepo = app.get(EvmSchemaRepository);
  await schemaRepo.ensureTables();
  console.log('Schema ClickHouse criado com sucesso.');
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

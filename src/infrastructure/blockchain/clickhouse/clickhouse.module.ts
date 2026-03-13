import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickHouseClient } from './clickhouse.client';

@Module({
  imports: [ConfigModule],
  providers: [ClickHouseClient],
  exports: [ClickHouseClient],
})
export class ClickHouseModule {}


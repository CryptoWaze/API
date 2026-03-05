import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly sql: ReturnType<typeof neon>;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    this.sql = neon(databaseUrl ?? '');
  }

  getClient(): ReturnType<typeof neon> {
    return this.sql;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { TokenUpdateCronService } from '../../../../src/presentation/tokens/token-update-cron.service';
import { ClickHouseClient } from '../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';
import { CoingeckoApiService } from '../../../../src/infrastructure/coingecko/coingecko-api.service';

describe('TokenUpdateCronService', () => {
  let service: TokenUpdateCronService;
  let clickhouse: { exec: jest.Mock; query: jest.Mock };
  let coingeckoApi: { getMarketsPage: jest.Mock };
  const envRestore = process.env.TOKEN_UPDATE_CRON_ENABLED;

  beforeEach(async () => {
    process.env.TOKEN_UPDATE_CRON_ENABLED = 'false';
    clickhouse = {
      exec: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue([]),
    };
    coingeckoApi = { getMarketsPage: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenUpdateCronService,
        { provide: ClickHouseClient, useValue: clickhouse },
        { provide: CoingeckoApiService, useValue: coingeckoApi },
      ],
    }).compile();

    service = module.get(TokenUpdateCronService);
  });

  afterEach(() => {
    process.env.TOKEN_UPDATE_CRON_ENABLED = envRestore;
  });

  it('handleTokenUpdate does nothing when cron is disabled', async () => {
    await service.handleTokenUpdate();

    expect(coingeckoApi.getMarketsPage).not.toHaveBeenCalled();
  });
});

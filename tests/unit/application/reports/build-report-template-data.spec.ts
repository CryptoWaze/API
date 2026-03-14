import { buildReportTemplateData } from '../../../../src/application/reports/build-report-template-data';
import type { GetCaseByIdResult } from '../../../../src/application/use-cases/get-case-by-id.use-case';

function minimalCaseData(overrides?: Partial<GetCaseByIdResult>): GetCaseByIdResult {
  return {
    id: 'case-1',
    name: 'Caso Teste',
    status: 'OPEN',
    totalAmountLostRaw: '1000000000000000000',
    totalAmountLostDecimal: '1.5',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    seeds: [
      {
        id: 'seed-1',
        txHash: '0xabc',
        initialWalletAddresses: ['0x111'],
        flowIds: ['flow-1'],
        chainSlug: 'eth',
        chainName: 'Ethereum',
        chainIconUrl: null,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        tokenPriceUsd: 2000,
        tokenImageUrl: null,
        amountRaw: '1000000000000000000',
        amountDecimal: '1',
        timestamp: '2024-01-01T12:00:00.000Z',
      },
    ],
    flows: [
      {
        id: 'flow-1',
        seedId: 'seed-1',
        chainSlug: 'eth',
        chainName: 'Ethereum',
        chainIconUrl: null,
        initialWalletAddress: '0x111',
        tokenAddress: null,
        tokenSymbol: 'ETH',
        tokenPriceUsd: 2000,
        tokenImageUrl: null,
        totalAmountRaw: '1000000000000000000',
        totalAmountDecimal: '1',
        hopsCount: 1,
        endpointAddress: '0x222',
        endpointReason: 'EXCHANGE_HOT_WALLET',
        endpointIsHotWallet: true,
        endpointExchangeName: 'Binance',
        endpointExchangeSlug: 'binance',
        endpointExchangeIconUrl: null,
        endpointHotWalletLabel: 'Binance Hot',
        wallets: [],
        transactions: [
          {
            id: 'tx-1',
            hopIndex: 0,
            txHash: '0xabc',
            fromAddress: '0x111',
            toAddress: '0x222',
            tokenAddress: null,
            tokenSymbol: 'ETH',
            tokenPriceUsd: 2000,
            tokenImageUrl: null,
            amountRaw: '1000000000000000000',
            amountDecimal: '1',
            timestamp: '2024-01-01T12:00:00.000Z',
            isEndpointHop: true,
          },
        ],
        edges: [],
      },
    ],
    mapping: { roots: [], connections: [] },
    ...overrides,
  };
}

describe('buildReportTemplateData', () => {
  it('maps case name and generatedAt', () => {
    const result = buildReportTemplateData(
      minimalCaseData(),
      '2024-06-01T10:00:00.000Z',
    );
    expect(result.caseName).toBe('Caso Teste');
    expect(result.generatedAt).toBe('2024-06-01T10:00:00.000Z');
    expect(result.totalAmountLostDecimal).toBe('1.5');
    expect(result.imagePlaceholder).toBe('[ --imagem-- ]');
  });

  it('maps seeds with txExplorerUrl', () => {
    const result = buildReportTemplateData(
      minimalCaseData(),
      '2024-06-01T10:00:00.000Z',
    );
    expect(result.seeds).toHaveLength(1);
    expect(result.seeds[0].txHash).toBe('0xabc');
    expect(result.seeds[0].chainSlug).toBe('eth');
    expect(result.seeds[0].txExplorerUrl).toContain('etherscan.io');
    expect(result.seeds[0].txExplorerUrl).toContain('0xabc');
    expect(result.seeds[0].initialWalletAddresses).toEqual(['0x111']);
  });

  it('maps flows with steps and explorer urls', () => {
    const result = buildReportTemplateData(
      minimalCaseData(),
      '2024-06-01T10:00:00.000Z',
    );
    expect(result.flows).toHaveLength(1);
    expect(result.flows[0].endpointLabel).toBe('Binance Hot');
    expect(result.flows[0].steps).toHaveLength(1);
    expect(result.flows[0].steps[0].fromAddress).toBe('0x111');
    expect(result.flows[0].steps[0].toAddress).toBe('0x222');
    expect(result.flows[0].steps[0].txExplorerUrl).toContain('0xabc');
    expect(result.flows[0].steps[0].fromExplorerUrl).toContain('0x111');
    expect(result.flows[0].steps[0].toExplorerUrl).toContain('0x222');
  });

  it('uses default endpoint label when endpointHotWalletLabel is null', () => {
    const data = minimalCaseData({
      flows: [
        {
          ...minimalCaseData().flows[0],
          endpointHotWalletLabel: null,
        },
      ],
    });
    const result = buildReportTemplateData(data, '2024-06-01T10:00:00.000Z');
    expect(result.flows[0].endpointLabel).toBe('Endereço final');
  });
});

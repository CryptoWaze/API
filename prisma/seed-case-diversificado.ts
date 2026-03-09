import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  CaseStatus,
  FlowEndpointReason,
  FlowEdgeOutcome,
} from '../src/generated/prisma';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const ETH_CHAIN_SLUG = 'eth';
const BINANCE_SLUG = 'binance';

const USDT_ETH_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const SEED_TX_HASH =
  '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678';
const SEED_TIMESTAMP = new Date('2025-03-01T10:00:00.000Z');

const WALLET_1 = '0x1111111111111111111111111111111111111111';
const WALLET_2 = '0x2222222222222222222222222222222222222222';
const WALLET_3 = '0x3333333333333333333333333333333333333333';
const WALLET_4 = '0x4444444444444444444444444444444444444444';
const WALLET_5 = '0x5555555555555555555555555555555555555555';
const WALLET_6 = '0x6666666666666666666666666666666666666666';
const WALLET_7 = '0x7777777777777777777777777777777777777777';
const WALLET_8 = '0x8888888888888888888888888888888888888888';
const WALLET_9 = '0x9999999999999999999999999999999999999999';

function txHash(seed: string): string {
  return `0x${seed.padStart(64, '0').slice(-64)}`;
}

async function main() {
  const chain = await prisma.chain.findUnique({
    where: { slug: ETH_CHAIN_SLUG },
  });
  if (!chain) {
    throw new Error(
      `Chain "${ETH_CHAIN_SLUG}" not found. Run prisma/seed.ts first.`,
    );
  }

  const exchange = await prisma.exchange.findUnique({
    where: { slug: BINANCE_SLUG },
  });
  if (!exchange) {
    throw new Error(
      `Exchange "${BINANCE_SLUG}" not found. Run prisma/seed.ts first.`,
    );
  }

  const hotWallets = await prisma.hotWallet.findMany({
    where: { exchangeId: exchange.id, chainId: chain.id },
    take: 2,
  });
  if (hotWallets.length < 2) {
    throw new Error(
      'Need at least 2 Binance ETH hot wallets. Run prisma/seed.ts first.',
    );
  }
  const [hot1, hot2] = hotWallets;

  const user = await prisma.user.upsert({
    where: { email: 'kauan@example.com' },
    create: {
      email: 'kauan@example.com',
      name: 'Kauan',
      password: await bcrypt.hash('Senha1234!', SALT_ROUNDS),
    },
    update: {},
  });

  const existingCase = await prisma.case.findFirst({
    where: { name: 'Caso Diversificado', createdByUserId: user.id },
  });
  if (existingCase) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        'Caso "Caso Diversificado" já existe. Remova-o primeiro se quiser recriar.',
      );
    }
    return;
  }

  const totalAmountLostRaw = '5000000000';
  const totalAmountLostDecimal = '4300.6';

  const caseRecord = await prisma.case.create({
    data: {
      name: 'Caso Diversificado',
      createdByUserId: user.id,
      status: CaseStatus.COMPLETED,
      totalAmountLostRaw,
      totalAmountLostDecimal,
    },
  });

  const seedRecord = await prisma.caseSeedTransaction.create({
    data: {
      caseId: caseRecord.id,
      chainId: chain.id,
      txHash: SEED_TX_HASH,
      tokenAddress: USDT_ETH_ADDRESS,
      tokenSymbol: 'USDT',
      amountRaw: '2500000000',
      amountDecimal: '2500',
      timestamp: SEED_TIMESTAMP,
    },
  });

  const flow1AmountRaw = '500000000000000000';
  const flow1AmountDecimal = '0.5';

  const flow1 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: null,
      tokenSymbol: 'ETH',
      totalAmountRaw: flow1AmountRaw,
      totalAmountDecimal: flow1AmountDecimal,
      hopsCount: 2,
      endpointAddress: hot1.address,
      endpointReason: FlowEndpointReason.EXCHANGE_HOT_WALLET,
      endpointHotWalletId: hot1.id,
      isEndpointExchange: true,
    },
  });

  await prisma.flowTransaction.createMany({
    data: [
      {
        flowId: flow1.id,
        chainId: chain.id,
        hopIndex: 0,
        txHash: txHash('d1h0'),
        fromAddress: WALLET_1,
        toAddress: WALLET_2,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: flow1AmountRaw,
        amountDecimal: flow1AmountDecimal,
        timestamp: SEED_TIMESTAMP,
        isEndpointHop: false,
      },
      {
        flowId: flow1.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('d1h1'),
        fromAddress: WALLET_2,
        toAddress: hot1.address,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: flow1AmountRaw,
        amountDecimal: flow1AmountDecimal,
        timestamp: new Date(SEED_TIMESTAMP.getTime() + 3600_000),
        isEndpointHop: true,
      },
    ],
  });

  await prisma.flowEdge.createMany({
    data: [
      {
        flowId: flow1.id,
        stepIndex: 0,
        fromAddress: WALLET_1,
        toAddress: WALLET_2,
        transferSymbol: 'ETH',
        transferAmountRaw: flow1AmountRaw,
        transferAmountDecimal: flow1AmountDecimal,
        txHash: txHash('d1h0'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: SEED_TIMESTAMP,
      },
      {
        flowId: flow1.id,
        stepIndex: 1,
        fromAddress: WALLET_2,
        toAddress: hot1.address,
        transferSymbol: 'ETH',
        transferAmountRaw: flow1AmountRaw,
        transferAmountDecimal: flow1AmountDecimal,
        txHash: txHash('d1h1'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: new Date(SEED_TIMESTAMP.getTime() + 3600_000),
      },
    ],
  });

  const flow2AmountRaw = '2500000000';
  const flow2AmountDecimal = '2500';

  const flow2 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: USDT_ETH_ADDRESS,
      tokenSymbol: 'USDT',
      totalAmountRaw: flow2AmountRaw,
      totalAmountDecimal: flow2AmountDecimal,
      hopsCount: 3,
      endpointAddress: hot2.address,
      endpointReason: FlowEndpointReason.EXCHANGE_HOT_WALLET,
      endpointHotWalletId: hot2.id,
      isEndpointExchange: true,
    },
  });

  const t2 = [
    SEED_TIMESTAMP,
    new Date(SEED_TIMESTAMP.getTime() + 3600_000),
    new Date(SEED_TIMESTAMP.getTime() + 7200_000),
    new Date(SEED_TIMESTAMP.getTime() + 10800_000),
  ];
  const flow2HopAmounts = [
    { raw: '800000000', decimal: '800' },
    { raw: '900000000', decimal: '900' },
    { raw: '800000000', decimal: '800' },
  ];
  await prisma.flowTransaction.createMany({
    data: [
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 0,
        txHash: txHash('d2h0'),
        fromAddress: WALLET_3,
        toAddress: WALLET_4,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: flow2HopAmounts[0].raw,
        amountDecimal: flow2HopAmounts[0].decimal,
        timestamp: t2[0],
        isEndpointHop: false,
      },
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('d2h1'),
        fromAddress: WALLET_4,
        toAddress: WALLET_5,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: flow2HopAmounts[1].raw,
        amountDecimal: flow2HopAmounts[1].decimal,
        timestamp: t2[1],
        isEndpointHop: false,
      },
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 2,
        txHash: txHash('d2h2'),
        fromAddress: WALLET_5,
        toAddress: hot2.address,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: flow2HopAmounts[2].raw,
        amountDecimal: flow2HopAmounts[2].decimal,
        timestamp: t2[2],
        isEndpointHop: true,
      },
    ],
  });

  await prisma.flowEdge.createMany({
    data: [
      {
        flowId: flow2.id,
        stepIndex: 0,
        fromAddress: WALLET_3,
        toAddress: WALLET_4,
        transferSymbol: 'USDT',
        transferAmountRaw: flow2HopAmounts[0].raw,
        transferAmountDecimal: flow2HopAmounts[0].decimal,
        txHash: txHash('d2h0'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[0],
      },
      {
        flowId: flow2.id,
        stepIndex: 1,
        fromAddress: WALLET_4,
        toAddress: WALLET_5,
        transferSymbol: 'USDT',
        transferAmountRaw: flow2HopAmounts[1].raw,
        transferAmountDecimal: flow2HopAmounts[1].decimal,
        txHash: txHash('d2h1'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[1],
      },
      {
        flowId: flow2.id,
        stepIndex: 2,
        fromAddress: WALLET_5,
        toAddress: hot2.address,
        transferSymbol: 'USDT',
        transferAmountRaw: flow2HopAmounts[2].raw,
        transferAmountDecimal: flow2HopAmounts[2].decimal,
        txHash: txHash('d2h2'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[2],
      },
    ],
  });

  const flow3AmountRaw = '1800000000';
  const flow3AmountDecimal = '1800';
  const flow3EthHopRaw = '100000000000000000';
  const flow3EthHopDecimal = '0.1';

  const flow3 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: USDT_ETH_ADDRESS,
      tokenSymbol: 'USDT',
      totalAmountRaw: flow3AmountRaw,
      totalAmountDecimal: flow3AmountDecimal,
      hopsCount: 5,
      endpointAddress: hot2.address,
      endpointReason: FlowEndpointReason.EXCHANGE_HOT_WALLET,
      endpointHotWalletId: hot2.id,
      isEndpointExchange: true,
    },
  });

  const t3 = [
    SEED_TIMESTAMP,
    new Date(SEED_TIMESTAMP.getTime() + 3600_000),
    new Date(SEED_TIMESTAMP.getTime() + 7200_000),
    new Date(SEED_TIMESTAMP.getTime() + 10800_000),
    new Date(SEED_TIMESTAMP.getTime() + 14400_000),
    new Date(SEED_TIMESTAMP.getTime() + 18000_000),
  ];
  await prisma.flowTransaction.createMany({
    data: [
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 0,
        txHash: txHash('d3h0'),
        fromAddress: WALLET_6,
        toAddress: WALLET_7,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: '500000000',
        amountDecimal: '500',
        timestamp: t3[0],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('d3h1'),
        fromAddress: WALLET_7,
        toAddress: WALLET_8,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: '600000000',
        amountDecimal: '600',
        timestamp: t3[1],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 2,
        txHash: txHash('d3h2'),
        fromAddress: WALLET_8,
        toAddress: WALLET_7,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: flow3EthHopRaw,
        amountDecimal: flow3EthHopDecimal,
        timestamp: t3[2],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 3,
        txHash: txHash('d3h3'),
        fromAddress: WALLET_7,
        toAddress: WALLET_9,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: '400000000',
        amountDecimal: '400',
        timestamp: t3[3],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 4,
        txHash: txHash('d3h4'),
        fromAddress: WALLET_9,
        toAddress: hot2.address,
        tokenAddress: USDT_ETH_ADDRESS,
        tokenSymbol: 'USDT',
        amountRaw: '300000000',
        amountDecimal: '300',
        timestamp: t3[4],
        isEndpointHop: true,
      },
    ],
  });

  await prisma.flowEdge.createMany({
    data: [
      {
        flowId: flow3.id,
        stepIndex: 0,
        fromAddress: WALLET_6,
        toAddress: WALLET_7,
        transferSymbol: 'USDT',
        transferAmountRaw: '500000000',
        transferAmountDecimal: '500',
        txHash: txHash('d3h0'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[0],
      },
      {
        flowId: flow3.id,
        stepIndex: 1,
        fromAddress: WALLET_7,
        toAddress: WALLET_8,
        transferSymbol: 'USDT',
        transferAmountRaw: '600000000',
        transferAmountDecimal: '600',
        txHash: txHash('d3h1'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[1],
      },
      {
        flowId: flow3.id,
        stepIndex: 2,
        fromAddress: WALLET_8,
        toAddress: WALLET_7,
        transferSymbol: 'ETH',
        transferAmountRaw: flow3EthHopRaw,
        transferAmountDecimal: flow3EthHopDecimal,
        txHash: txHash('d3h2'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[2],
      },
      {
        flowId: flow3.id,
        stepIndex: 3,
        fromAddress: WALLET_7,
        toAddress: WALLET_9,
        transferSymbol: 'USDT',
        transferAmountRaw: '400000000',
        transferAmountDecimal: '400',
        txHash: txHash('d3h3'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[3],
      },
      {
        flowId: flow3.id,
        stepIndex: 4,
        fromAddress: WALLET_9,
        toAddress: hot2.address,
        transferSymbol: 'USDT',
        transferAmountRaw: '300000000',
        transferAmountDecimal: '300',
        txHash: txHash('d3h4'),
        tokenAddress: USDT_ETH_ADDRESS,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[4],
      },
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Caso fictício "Caso Diversificado" criado: 1 seed, 3 flows. Flow 1 termina em 1 hot wallet (ETH). Flows 2 e 3 terminam na mesma hot wallet (USDT; flow 3 com um hop em ETH).',
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

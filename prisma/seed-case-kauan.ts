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

const SEED_TX_HASH =
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';
const SEED_AMOUNT_RAW = '1000000000000000000';
const SEED_AMOUNT_DECIMAL = '1.0';
const SEED_TIMESTAMP = new Date('2025-02-15T14:30:00.000Z');

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
    take: 3,
  });
  if (hotWallets.length < 3) {
    throw new Error(
      'Need at least 3 Binance ETH hot wallets. Run prisma/seed.ts first.',
    );
  }
  const [hot1, hot2, hot3] = hotWallets;

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
    where: { name: 'Kauan', createdByUserId: user.id },
  });
  if (existingCase) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Caso "Kauan" já existe. Remova-o primeiro se quiser recriar.');
    }
    return;
  }

  const totalAmountRaw = SEED_AMOUNT_RAW;
  const totalAmountDecimal = SEED_AMOUNT_DECIMAL;

  const caseRecord = await prisma.case.create({
    data: {
      name: 'Kauan',
      createdByUserId: user.id,
      status: CaseStatus.COMPLETED,
      totalAmountLostRaw: totalAmountRaw,
      totalAmountLostDecimal: totalAmountDecimal,
    },
  });

  const seedRecord = await prisma.caseSeedTransaction.create({
    data: {
      caseId: caseRecord.id,
      chainId: chain.id,
      txHash: SEED_TX_HASH,
      tokenAddress: null,
      tokenSymbol: 'ETH',
      amountRaw: totalAmountRaw,
      amountDecimal: totalAmountDecimal,
      timestamp: SEED_TIMESTAMP,
    },
  });

  const flow1 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: null,
      tokenSymbol: 'ETH',
      totalAmountRaw,
      totalAmountDecimal,
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
        txHash: txHash('f1h0'),
        fromAddress: WALLET_1,
        toAddress: WALLET_2,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: SEED_TIMESTAMP,
        isEndpointHop: false,
      },
      {
        flowId: flow1.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('f1h1'),
        fromAddress: WALLET_2,
        toAddress: hot1.address,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
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
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f1h0'),
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
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f1h1'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: new Date(SEED_TIMESTAMP.getTime() + 3600_000),
      },
    ],
  });

  const flow2 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: null,
      tokenSymbol: 'ETH',
      totalAmountRaw,
      totalAmountDecimal,
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
  await prisma.flowTransaction.createMany({
    data: [
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 0,
        txHash: txHash('f2h0'),
        fromAddress: WALLET_3,
        toAddress: WALLET_4,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t2[0],
        isEndpointHop: false,
      },
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('f2h1'),
        fromAddress: WALLET_4,
        toAddress: WALLET_5,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t2[1],
        isEndpointHop: false,
      },
      {
        flowId: flow2.id,
        chainId: chain.id,
        hopIndex: 2,
        txHash: txHash('f2h2'),
        fromAddress: WALLET_5,
        toAddress: hot2.address,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
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
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f2h0'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[0],
      },
      {
        flowId: flow2.id,
        stepIndex: 1,
        fromAddress: WALLET_4,
        toAddress: WALLET_5,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f2h1'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[1],
      },
      {
        flowId: flow2.id,
        stepIndex: 2,
        fromAddress: WALLET_5,
        toAddress: hot2.address,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f2h2'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t2[2],
      },
    ],
  });

  const flow3 = await prisma.flow.create({
    data: {
      caseId: caseRecord.id,
      seedId: seedRecord.id,
      chainId: chain.id,
      tokenAddress: null,
      tokenSymbol: 'ETH',
      totalAmountRaw,
      totalAmountDecimal,
      hopsCount: 5,
      endpointAddress: hot3.address,
      endpointReason: FlowEndpointReason.EXCHANGE_HOT_WALLET,
      endpointHotWalletId: hot3.id,
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
        txHash: txHash('f3h0'),
        fromAddress: WALLET_6,
        toAddress: WALLET_7,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t3[0],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 1,
        txHash: txHash('f3h1'),
        fromAddress: WALLET_7,
        toAddress: WALLET_8,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t3[1],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 2,
        txHash: txHash('f3h2'),
        fromAddress: WALLET_8,
        toAddress: WALLET_7,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t3[2],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 3,
        txHash: txHash('f3h3'),
        fromAddress: WALLET_7,
        toAddress: WALLET_9,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
        timestamp: t3[3],
        isEndpointHop: false,
      },
      {
        flowId: flow3.id,
        chainId: chain.id,
        hopIndex: 4,
        txHash: txHash('f3h4'),
        fromAddress: WALLET_9,
        toAddress: hot3.address,
        tokenAddress: null,
        tokenSymbol: 'ETH',
        amountRaw: totalAmountRaw,
        amountDecimal: totalAmountDecimal,
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
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f3h0'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[0],
      },
      {
        flowId: flow3.id,
        stepIndex: 1,
        fromAddress: WALLET_7,
        toAddress: WALLET_8,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f3h1'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[1],
      },
      {
        flowId: flow3.id,
        stepIndex: 2,
        fromAddress: WALLET_8,
        toAddress: WALLET_7,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f3h2'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[2],
      },
      {
        flowId: flow3.id,
        stepIndex: 3,
        fromAddress: WALLET_7,
        toAddress: WALLET_9,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f3h3'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[3],
      },
      {
        flowId: flow3.id,
        stepIndex: 4,
        fromAddress: WALLET_9,
        toAddress: hot3.address,
        transferSymbol: 'ETH',
        transferAmountRaw: totalAmountRaw,
        transferAmountDecimal: totalAmountDecimal,
        txHash: txHash('f3h4'),
        tokenAddress: null,
        outcome: FlowEdgeOutcome.SUCCESS,
        transferTimestamp: t3[4],
      },
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'Caso fictício "Kauan" criado: 1 seed, 3 flows (3, 4 e 6 carteiras), todos terminando em hot wallet Binance.',
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

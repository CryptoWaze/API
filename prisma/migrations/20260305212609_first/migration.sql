-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('BSC', 'ETH');

-- CreateEnum
CREATE TYPE "FlowEndpointReason" AS ENUM ('EXCHANGE_HOT_WALLET', 'MAX_HOPS_REACHED', 'NO_OUTGOING_ABOVE_THRESHOLD', 'CYCLE_DETECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotWallet" (
    "id" TEXT NOT NULL,
    "exchangeId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "blockchain" "Blockchain" NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "totalAmountLostRaw" TEXT NOT NULL,
    "totalAmountLostDecimal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSeedTransaction" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockchain" "Blockchain" NOT NULL,
    "tokenAddress" TEXT,
    "tokenSymbol" TEXT,
    "amountRaw" TEXT NOT NULL,
    "amountDecimal" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseSeedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "blockchain" "Blockchain" NOT NULL,
    "tokenAddress" TEXT,
    "tokenSymbol" TEXT,
    "totalAmountRaw" TEXT NOT NULL,
    "totalAmountDecimal" TEXT NOT NULL,
    "hopsCount" INTEGER NOT NULL,
    "endpointAddress" TEXT NOT NULL,
    "endpointReason" "FlowEndpointReason" NOT NULL,
    "endpointHotWalletId" TEXT,
    "isEndpointExchange" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowTransaction" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "hopIndex" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockchain" "Blockchain" NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "tokenSymbol" TEXT,
    "amountRaw" TEXT NOT NULL,
    "amountDecimal" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "isEndpointHop" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_slug_key" ON "Exchange"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Case_externalId_key" ON "Case"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "FlowTransaction_flowId_hopIndex_key" ON "FlowTransaction"("flowId", "hopIndex");

-- AddForeignKey
ALTER TABLE "HotWallet" ADD CONSTRAINT "HotWallet_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSeedTransaction" ADD CONSTRAINT "CaseSeedTransaction_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "CaseSeedTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_endpointHotWalletId_fkey" FOREIGN KEY ("endpointHotWalletId") REFERENCES "HotWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowTransaction" ADD CONSTRAINT "FlowTransaction_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

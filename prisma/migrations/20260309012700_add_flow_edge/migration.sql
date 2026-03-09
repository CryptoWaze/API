-- CreateEnum
CREATE TYPE "FlowEdgeOutcome" AS ENUM ('SUCCESS', 'NO_OUTBOUND', 'MAX_WALLETS_REACHED', 'EXHAUSTED_OPTIONS');

-- CreateTable
CREATE TABLE "FlowEdge" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "transferSymbol" TEXT,
    "transferAmountRaw" TEXT,
    "transferAmountDecimal" TEXT,
    "txHash" TEXT,
    "tokenAddress" TEXT,
    "outcome" "FlowEdgeOutcome",
    "transferTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowEdge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlowEdge_flowId_stepIndex_key" ON "FlowEdge"("flowId", "stepIndex");

-- AddForeignKey
ALTER TABLE "FlowEdge" ADD CONSTRAINT "FlowEdge_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'PROCESSING', 'COMPLETED', 'PARTIALLY', 'FAILED');

-- CreateEnum
CREATE TYPE "FlowTraceLogStatus" AS ENUM ('SUCCESS', 'NO_OUTBOUND', 'MAX_WALLETS_REACHED');

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "status" "CaseStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "FlowTraceLog" (
    "id" TEXT NOT NULL,
    "inputAddress" TEXT NOT NULL,
    "chainSlug" TEXT NOT NULL,
    "status" "FlowTraceLogStatus" NOT NULL,
    "endpointAddress" TEXT,
    "failureAtAddress" TEXT,
    "failureReason" TEXT,
    "stepsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowTraceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowTraceLogStep" (
    "id" TEXT NOT NULL,
    "flowTraceLogId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "transferSymbol" TEXT,
    "transferAmountRaw" TEXT,
    "transferAmountDecimal" TEXT,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowTraceLogStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlowTraceLogStep_flowTraceLogId_stepIndex_key" ON "FlowTraceLogStep"("flowTraceLogId", "stepIndex");

-- AddForeignKey
ALTER TABLE "FlowTraceLogStep" ADD CONSTRAINT "FlowTraceLogStep_flowTraceLogId_fkey" FOREIGN KEY ("flowTraceLogId") REFERENCES "FlowTraceLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

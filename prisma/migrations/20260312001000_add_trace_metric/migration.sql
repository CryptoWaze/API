-- CreateTable
CREATE TABLE "TraceMetric" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "traceId" TEXT NOT NULL,
    "seedIndex" INTEGER,
    "mode" TEXT,
    "success" BOOLEAN NOT NULL,
    "totalDurationMs" INTEGER NOT NULL,
    "exchangeFoundAtMs" INTEGER,
    "flowDurationsJson" JSONB,
    "walletDurationsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TraceMetric_caseId_idx" ON "TraceMetric"("caseId");

-- CreateIndex
CREATE INDEX "TraceMetric_traceId_idx" ON "TraceMetric"("traceId");

-- AddForeignKey
ALTER TABLE "TraceMetric" ADD CONSTRAINT "TraceMetric_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;


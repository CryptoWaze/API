-- CreateTable
CREATE TABLE "FlowWallet" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "nodeIndex" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "nickname" TEXT,
    "position" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlowWallet_flowId_nodeIndex_key" ON "FlowWallet"("flowId", "nodeIndex");

-- AddForeignKey
ALTER TABLE "FlowWallet" ADD CONSTRAINT "FlowWallet_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

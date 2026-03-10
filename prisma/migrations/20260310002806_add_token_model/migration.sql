-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "coingeckoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageUrl" TEXT,
    "currentPrice" TEXT,
    "marketCap" TEXT,
    "marketCapRank" INTEGER,
    "totalVolume" TEXT,
    "lastUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_coingeckoId_key" ON "Token"("coingeckoId");

/*
  Warnings:

  - You are about to drop the column `blockchain` on the `CaseSeedTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain` on the `FlowTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain` on the `HotWallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exchangeId,chainId,address]` on the table `HotWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chainId` to the `CaseSeedTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `FlowTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `HotWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseSeedTransaction" DROP COLUMN "blockchain",
ADD COLUMN     "chainId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "blockchain",
ADD COLUMN     "chainId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FlowTransaction" DROP COLUMN "blockchain",
ADD COLUMN     "chainId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HotWallet" DROP COLUMN "blockchain",
ADD COLUMN     "chainId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Blockchain";

-- CreateTable
CREATE TABLE "Chain" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_slug_key" ON "Chain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HotWallet_exchangeId_chainId_address_key" ON "HotWallet"("exchangeId", "chainId", "address");

-- AddForeignKey
ALTER TABLE "HotWallet" ADD CONSTRAINT "HotWallet_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSeedTransaction" ADD CONSTRAINT "CaseSeedTransaction_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowTransaction" ADD CONSTRAINT "FlowTransaction_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

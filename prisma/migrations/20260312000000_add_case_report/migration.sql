-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'DOCX');

-- CreateTable
CREATE TABLE "CaseReport" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseReport_caseId_idx" ON "CaseReport"("caseId");

-- CreateIndex
CREATE INDEX "CaseReport_caseId_generatedAt_idx" ON "CaseReport"("caseId", "generatedAt");

-- AddForeignKey
ALTER TABLE "CaseReport" ADD CONSTRAINT "CaseReport_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add deletedAt columns for soft delete

ALTER TABLE "Flow"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "FlowTransaction"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "FlowEdge"
ADD COLUMN "deletedAt" TIMESTAMP(3);


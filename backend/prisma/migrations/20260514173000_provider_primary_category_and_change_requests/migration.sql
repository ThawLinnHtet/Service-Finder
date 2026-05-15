-- CreateEnum
CREATE TYPE "CategoryChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ProviderProfile"
ADD COLUMN "primaryCategoryId" TEXT;

-- Backfill primary category from provider's earliest service
UPDATE "ProviderProfile" p
SET "primaryCategoryId" = s."categoryId"
FROM (
  SELECT DISTINCT ON ("providerId") "providerId", "categoryId"
  FROM "Service"
  ORDER BY "providerId", "createdAt" ASC
) s
WHERE p."userId" = s."providerId"
  AND p."primaryCategoryId" IS NULL;

-- CreateTable
CREATE TABLE "ProviderCategoryChangeRequest" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "currentCategoryId" TEXT NOT NULL,
  "requestedCategoryId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "price" DECIMAL(12,2) NOT NULL,
  "experienceYears" INTEGER NOT NULL,
  "predefinedSkillIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "customSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "status" "CategoryChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
  "adminRejectionReason" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProviderCategoryChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderProfile_primaryCategoryId_idx" ON "ProviderProfile"("primaryCategoryId");

-- CreateIndex
CREATE INDEX "ProviderCategoryChangeRequest_providerId_idx" ON "ProviderCategoryChangeRequest"("providerId");

-- CreateIndex
CREATE INDEX "ProviderCategoryChangeRequest_status_idx" ON "ProviderCategoryChangeRequest"("status");

-- CreateIndex
CREATE INDEX "ProviderCategoryChangeRequest_createdAt_idx" ON "ProviderCategoryChangeRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_primaryCategoryId_fkey" FOREIGN KEY ("primaryCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategoryChangeRequest" ADD CONSTRAINT "ProviderCategoryChangeRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategoryChangeRequest" ADD CONSTRAINT "ProviderCategoryChangeRequest_currentCategoryId_fkey" FOREIGN KEY ("currentCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategoryChangeRequest" ADD CONSTRAINT "ProviderCategoryChangeRequest_requestedCategoryId_fkey" FOREIGN KEY ("requestedCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

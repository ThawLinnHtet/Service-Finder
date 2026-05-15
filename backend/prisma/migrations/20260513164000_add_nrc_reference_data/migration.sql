-- CreateEnum
CREATE TYPE "NrcType" AS ENUM ('N', 'E', 'P', 'A', 'F', 'THA');

-- CreateTable
CREATE TABLE "NrcState" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NrcState_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "NrcTownship" (
    "stateCode" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NrcTownship_pkey" PRIMARY KEY ("stateCode", "code")
);

-- Seed existing provider NRC values to prevent migration conflicts
INSERT INTO "NrcState" ("code", "name", "createdAt", "updatedAt")
SELECT DISTINCT "nrcState", "nrcState", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "ProviderProfile"
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "NrcTownship" ("stateCode", "code", "name", "createdAt", "updatedAt")
SELECT DISTINCT "nrcState", "nrcTownship", "nrcTownship", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "ProviderProfile"
ON CONFLICT ("stateCode", "code") DO NOTHING;

-- AlterTable
ALTER TABLE "ProviderProfile"
ADD COLUMN     "nrcStateCode" TEXT,
ADD COLUMN     "nrcTownshipCode" TEXT,
ADD COLUMN     "nrcType" "NrcType" NOT NULL DEFAULT 'N';

-- Backfill from legacy columns
UPDATE "ProviderProfile"
SET
  "nrcStateCode" = "nrcState",
  "nrcTownshipCode" = "nrcTownship"
WHERE "nrcStateCode" IS NULL OR "nrcTownshipCode" IS NULL;

-- Make new columns required and drop legacy columns
ALTER TABLE "ProviderProfile"
ALTER COLUMN "nrcStateCode" SET NOT NULL,
ALTER COLUMN "nrcTownshipCode" SET NOT NULL,
ALTER COLUMN "nrcType" DROP DEFAULT,
DROP COLUMN "nrcState",
DROP COLUMN "nrcTownship";

-- CreateIndex
CREATE UNIQUE INDEX "NrcState_name_key" ON "NrcState"("name");

-- CreateIndex
CREATE INDEX "NrcTownship_stateCode_idx" ON "NrcTownship"("stateCode");

-- CreateIndex
CREATE UNIQUE INDEX "NrcTownship_stateCode_name_key" ON "NrcTownship"("stateCode", "name");

-- CreateIndex
CREATE INDEX "ProviderProfile_nrcStateCode_idx" ON "ProviderProfile"("nrcStateCode");

-- CreateIndex
CREATE INDEX "ProviderProfile_nrcTownshipCode_idx" ON "ProviderProfile"("nrcTownshipCode");

-- CreateIndex
CREATE INDEX "ProviderProfile_nrcType_idx" ON "ProviderProfile"("nrcType");

-- AddForeignKey
ALTER TABLE "NrcTownship" ADD CONSTRAINT "NrcTownship_stateCode_fkey" FOREIGN KEY ("stateCode") REFERENCES "NrcState"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_nrcStateCode_fkey" FOREIGN KEY ("nrcStateCode") REFERENCES "NrcState"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_nrcStateCode_nrcTownshipCode_fkey" FOREIGN KEY ("nrcStateCode", "nrcTownshipCode") REFERENCES "NrcTownship"("stateCode", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

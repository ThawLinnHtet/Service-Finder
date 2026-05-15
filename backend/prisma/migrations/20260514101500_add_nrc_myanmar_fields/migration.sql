-- AlterTable
ALTER TABLE "NrcState"
ADD COLUMN "nameMm" TEXT;

-- AlterTable
ALTER TABLE "NrcTownship"
ADD COLUMN "codeMm" TEXT,
ADD COLUMN "nameMm" TEXT;

-- Backfill existing rows to keep migration safe
UPDATE "NrcState"
SET "nameMm" = "name"
WHERE "nameMm" IS NULL;

UPDATE "NrcTownship"
SET
  "codeMm" = "code",
  "nameMm" = "name"
WHERE "codeMm" IS NULL OR "nameMm" IS NULL;

-- Make new columns required
ALTER TABLE "NrcState"
ALTER COLUMN "nameMm" SET NOT NULL;

ALTER TABLE "NrcTownship"
ALTER COLUMN "codeMm" SET NOT NULL,
ALTER COLUMN "nameMm" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProviderCategoryChangeRequest"
ADD COLUMN "title" TEXT;

-- Backfill title from provider's earliest service profile title
UPDATE "ProviderCategoryChangeRequest" r
SET "title" = s."title"
FROM "ProviderProfile" p
JOIN LATERAL (
  SELECT "title"
  FROM "Service"
  WHERE "providerId" = p."userId"
  ORDER BY "createdAt" ASC
  LIMIT 1
) s ON TRUE
WHERE r."providerId" = p."id"
  AND r."title" IS NULL;

-- Safety fallback for rows without service data
UPDATE "ProviderCategoryChangeRequest"
SET "title" = 'Service Profile'
WHERE "title" IS NULL;

-- AlterTable
ALTER TABLE "ProviderCategoryChangeRequest"
ALTER COLUMN "title" SET NOT NULL;

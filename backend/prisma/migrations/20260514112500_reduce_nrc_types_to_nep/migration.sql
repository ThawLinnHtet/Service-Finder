DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "ProviderProfile"
    WHERE "nrcType"::text NOT IN ('N', 'E', 'P')
  ) THEN
    RAISE EXCEPTION 'Cannot migrate NrcType: existing ProviderProfile rows use unsupported values outside N/E/P';
  END IF;
END $$;

CREATE TYPE "NrcType_new" AS ENUM ('N', 'E', 'P');

ALTER TABLE "ProviderProfile"
ALTER COLUMN "nrcType" TYPE "NrcType_new"
USING ("nrcType"::text::"NrcType_new");

DROP TYPE "NrcType";

ALTER TYPE "NrcType_new" RENAME TO "NrcType";

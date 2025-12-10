/*
  Warnings:

  - The values [OTHER] on the enum `PlatformType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlatformType_new" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN', 'FACEBOOK', 'WHATSAPP', 'TELEGRAM', 'WEBSITE');
ALTER TABLE "ReferralCode" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TABLE "SaleEvent" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TABLE "ClickEvent" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TYPE "PlatformType" RENAME TO "PlatformType_old";
ALTER TYPE "PlatformType_new" RENAME TO "PlatformType";
DROP TYPE "public"."PlatformType_old";
COMMIT;

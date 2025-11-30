/*
  Warnings:

  - The values [TWITTER] on the enum `PlatformType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `cpsCommissionType` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpsValue` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayoutModel" AS ENUM ('CPS', 'CPC', 'BOTH');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterEnum
BEGIN;
CREATE TYPE "PlatformType_new" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN', 'FACEBOOK', 'OTHER');
ALTER TABLE "CreatorPlatform" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TABLE "ReferralCode" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TABLE "SaleEvent" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TABLE "ClickEvent" ALTER COLUMN "platform" TYPE "PlatformType_new" USING ("platform"::text::"PlatformType_new");
ALTER TYPE "PlatformType" RENAME TO "PlatformType_old";
ALTER TYPE "PlatformType_new" RENAME TO "PlatformType";
DROP TYPE "public"."PlatformType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "cpcValue" DOUBLE PRECISION,
ADD COLUMN     "cpsCommissionType" "CommissionType" NOT NULL,
ADD COLUMN     "cpsValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "payoutModel" "PayoutModel" NOT NULL DEFAULT 'BOTH';

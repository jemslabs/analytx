/*
  Warnings:

  - You are about to drop the column `campaignId` on the `ReferralCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReferralCode" DROP CONSTRAINT "ReferralCode_campaignId_fkey";

-- AlterTable
ALTER TABLE "ReferralCode" DROP COLUMN "campaignId";

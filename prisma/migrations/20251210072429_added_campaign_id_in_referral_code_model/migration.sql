/*
  Warnings:

  - Added the required column `campaignId` to the `ReferralCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferralCode" ADD COLUMN     "campaignId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

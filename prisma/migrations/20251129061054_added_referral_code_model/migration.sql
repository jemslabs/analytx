/*
  Warnings:

  - You are about to drop the column `referralCode` on the `CampaignMember` table. All the data in the column will be lost.
  - Added the required column `platform` to the `ClickEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `SaleEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CampaignMember_referralCode_key";

-- AlterTable
ALTER TABLE "CampaignMember" DROP COLUMN "referralCode";

-- AlterTable
ALTER TABLE "ClickEvent" ADD COLUMN     "platform" "PlatformType" NOT NULL;

-- AlterTable
ALTER TABLE "SaleEvent" ADD COLUMN     "platform" "PlatformType" NOT NULL;

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_memberId_platform_key" ON "ReferralCode"("memberId", "platform");

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "CampaignMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

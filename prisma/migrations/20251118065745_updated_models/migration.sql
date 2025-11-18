/*
  Warnings:

  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `BrandProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `CreatorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `BrandProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CreatorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niche` to the `CreatorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `CreatorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CreatorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreatorNiche" AS ENUM ('FASHION', 'BEAUTY', 'TECH', 'GAMING', 'FITNESS', 'LIFESTYLE', 'FOOD', 'TRAVEL', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IndustryCategory" ADD VALUE 'TRAVEL_AND_HOSPITALITY';
ALTER TYPE "IndustryCategory" ADD VALUE 'FINANCE';
ALTER TYPE "IndustryCategory" ADD VALUE 'AUTOMOTIVE';
ALTER TYPE "IndustryCategory" ADD VALUE 'EDUCATION';
ALTER TYPE "IndustryCategory" ADD VALUE 'REAL_ESTATE';
ALTER TYPE "IndustryCategory" ADD VALUE 'PARENTING';

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_brandId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignProduct" DROP CONSTRAINT "CampaignProduct_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignProduct" DROP CONSTRAINT "CampaignProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- AlterTable
ALTER TABLE "BrandProfile" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "industry" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "niche" "CreatorNiche" NOT NULL,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Campaign";

-- DropTable
DROP TABLE "CampaignProduct";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "CreatorPlatform" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "username" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_slug_key" ON "BrandProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_slug_key" ON "CreatorProfile"("slug");

-- AddForeignKey
ALTER TABLE "CreatorPlatform" ADD CONSTRAINT "CreatorPlatform_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

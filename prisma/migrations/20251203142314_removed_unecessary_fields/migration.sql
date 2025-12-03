/*
  Warnings:

  - You are about to drop the `CreatorPlatform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreatorPlatform" DROP CONSTRAINT "CreatorPlatform_creatorId_fkey";

-- AlterTable
ALTER TABLE "BrandProfile" ALTER COLUMN "apiKey" DROP NOT NULL;

-- DropTable
DROP TABLE "CreatorPlatform";

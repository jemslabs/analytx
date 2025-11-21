/*
  Warnings:

  - You are about to drop the column `logo` on the `BrandProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `CreatorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BrandProfile" DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "CreatorProfile" DROP COLUMN "profilePic";

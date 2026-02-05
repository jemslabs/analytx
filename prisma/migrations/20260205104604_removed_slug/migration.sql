/*
  Warnings:

  - You are about to drop the column `slug` on the `BrandProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BrandProfile_slug_key";

-- AlterTable
ALTER TABLE "BrandProfile" DROP COLUMN "slug";

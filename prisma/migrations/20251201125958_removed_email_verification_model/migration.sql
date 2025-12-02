/*
  Warnings:

  - You are about to drop the column `verified` on the `BrandProfile` table. All the data in the column will be lost.
  - You are about to drop the `EmailVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "BrandProfile" DROP COLUMN "verified";

-- DropTable
DROP TABLE "EmailVerification";

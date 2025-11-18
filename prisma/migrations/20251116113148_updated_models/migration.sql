/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BrandProfile" ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

/*
  Warnings:

  - You are about to drop the column `slug` on the `Campaign` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Campaign_slug_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "slug";

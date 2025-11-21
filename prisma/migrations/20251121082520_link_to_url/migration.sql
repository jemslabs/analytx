/*
  Warnings:

  - You are about to drop the column `link` on the `CreatorPlatform` table. All the data in the column will be lost.
  - Added the required column `url` to the `CreatorPlatform` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreatorPlatform" DROP COLUMN "link",
ADD COLUMN     "url" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `ClickEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `ClickEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId,platform,date]` on the table `ClickEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `ClickEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClickEvent" DROP COLUMN "ipAddress",
DROP COLUMN "timestamp",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ClickEvent_memberId_platform_date_key" ON "ClickEvent"("memberId", "platform", "date");

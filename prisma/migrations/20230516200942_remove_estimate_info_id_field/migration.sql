/*
  Warnings:

  - You are about to drop the column `estimateInfoId` on the `estimates` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `estimates_estimateInfoId_fkey` ON `estimates`;

-- AlterTable
ALTER TABLE `estimates` DROP COLUMN `estimateInfoId`;

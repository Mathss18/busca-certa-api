/*
  Warnings:

  - A unique constraint covering the columns `[nonce]` on the table `estimates_info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nonce` to the `estimates_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `estimates_info` ADD COLUMN `nonce` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `estimates_info_nonce_key` ON `estimates_info`(`nonce`);

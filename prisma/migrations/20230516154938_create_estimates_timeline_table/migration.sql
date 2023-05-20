/*
  Warnings:

  - You are about to drop the `estimates_info` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nonce]` on the table `estimates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nonce` to the `estimates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `estimates` DROP FOREIGN KEY `estimates_estimateInfoId_fkey`;

-- AlterTable
ALTER TABLE `estimates` ADD COLUMN `nonce` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `estimates_info`;

-- CreateTable
CREATE TABLE `estimates_timeline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimateId` INTEGER NOT NULL,
    `message` VARCHAR(191) NULL,
    `code` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `estimates_nonce_key` ON `estimates`(`nonce`);

-- AddForeignKey
ALTER TABLE `estimates_timeline` ADD CONSTRAINT `estimates_timeline_estimateId_fkey` FOREIGN KEY (`estimateId`) REFERENCES `estimates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

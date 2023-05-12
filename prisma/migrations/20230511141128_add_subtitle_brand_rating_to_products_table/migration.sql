/*
  Warnings:

  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - Added the required column `brand` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `sku`,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN `subtitle` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `procuct_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

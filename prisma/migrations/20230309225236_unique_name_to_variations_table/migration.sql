/*
  Warnings:

  - You are about to drop the `products_variations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_variations_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variations_options` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `variations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `basket_variations` DROP FOREIGN KEY `basket_variations_variationsOptionsId_fkey`;

-- DropForeignKey
ALTER TABLE `products_variations` DROP FOREIGN KEY `products_variations_productsId_fkey`;

-- DropForeignKey
ALTER TABLE `products_variations` DROP FOREIGN KEY `products_variations_variationsId_fkey`;

-- DropForeignKey
ALTER TABLE `products_variations_options` DROP FOREIGN KEY `products_variations_options_productsVariationsId_fkey`;

-- DropForeignKey
ALTER TABLE `products_variations_options` DROP FOREIGN KEY `products_variations_options_variationsOptionsId_fkey`;

-- DropForeignKey
ALTER TABLE `variations_options` DROP FOREIGN KEY `variations_options_variationId_fkey`;

-- DropTable
DROP TABLE `products_variations`;

-- DropTable
DROP TABLE `products_variations_options`;

-- DropTable
DROP TABLE `variations_options`;

-- CreateTable
CREATE TABLE `variation_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `variationId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productsId` INTEGER NOT NULL,
    `variationsId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variation_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productsVariationsId` INTEGER NOT NULL,
    `variationsOptionsId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `variations_name_key` ON `variations`(`name`);

-- AddForeignKey
ALTER TABLE `variation_options` ADD CONSTRAINT `variation_options_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variations` ADD CONSTRAINT `product_variations_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variations` ADD CONSTRAINT `product_variations_variationsId_fkey` FOREIGN KEY (`variationsId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variation_options` ADD CONSTRAINT `product_variation_options_productsVariationsId_fkey` FOREIGN KEY (`productsVariationsId`) REFERENCES `product_variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variation_options` ADD CONSTRAINT `product_variation_options_variationsOptionsId_fkey` FOREIGN KEY (`variationsOptionsId`) REFERENCES `variation_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basket_variations` ADD CONSTRAINT `basket_variations_variationsOptionsId_fkey` FOREIGN KEY (`variationsOptionsId`) REFERENCES `variation_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

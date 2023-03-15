/*
  Warnings:

  - You are about to drop the column `productsVariationsId` on the `product_variation_options` table. All the data in the column will be lost.
  - You are about to drop the column `variationsOptionsId` on the `product_variation_options` table. All the data in the column will be lost.
  - Added the required column `productVariationId` to the `product_variation_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variationOptionId` to the `product_variation_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_variation_options` DROP FOREIGN KEY `product_variation_options_productsVariationsId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variation_options` DROP FOREIGN KEY `product_variation_options_variationsOptionsId_fkey`;

-- AlterTable
ALTER TABLE `product_variation_options` DROP COLUMN `productsVariationsId`,
    DROP COLUMN `variationsOptionsId`,
    ADD COLUMN `productVariationId` INTEGER NOT NULL,
    ADD COLUMN `variationOptionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product_variation_options` ADD CONSTRAINT `product_variation_options_productVariationId_fkey` FOREIGN KEY (`productVariationId`) REFERENCES `product_variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variation_options` ADD CONSTRAINT `product_variation_options_variationOptionId_fkey` FOREIGN KEY (`variationOptionId`) REFERENCES `variation_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

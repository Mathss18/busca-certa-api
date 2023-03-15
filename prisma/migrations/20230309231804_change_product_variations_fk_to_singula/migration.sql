/*
  Warnings:

  - You are about to drop the column `productsId` on the `product_variations` table. All the data in the column will be lost.
  - You are about to drop the column `variationsId` on the `product_variations` table. All the data in the column will be lost.
  - Added the required column `productId` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variationId` to the `product_variations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_variations` DROP FOREIGN KEY `product_variations_productsId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variations` DROP FOREIGN KEY `product_variations_variationsId_fkey`;

-- AlterTable
ALTER TABLE `product_variations` DROP COLUMN `productsId`,
    DROP COLUMN `variationsId`,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `variationId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product_variations` ADD CONSTRAINT `product_variations_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variations` ADD CONSTRAINT `product_variations_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

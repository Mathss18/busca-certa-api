/*
  Warnings:

  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUpdatedAt` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `priceUpdatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `sku` VARCHAR(191) NULL,
    ADD COLUMN `supplierId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

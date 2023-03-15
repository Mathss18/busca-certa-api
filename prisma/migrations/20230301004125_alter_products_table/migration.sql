-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_productCategoryId_fkey`;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_productCategoryId_fkey` FOREIGN KEY (`productCategoryId`) REFERENCES `products_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

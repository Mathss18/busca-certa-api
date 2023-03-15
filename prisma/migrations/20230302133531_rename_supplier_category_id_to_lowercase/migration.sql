-- DropForeignKey
ALTER TABLE `suppliers` DROP FOREIGN KEY `suppliers_SupplierCategoryId_fkey`;

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_supplierCategoryId_fkey` FOREIGN KEY (`supplierCategoryId`) REFERENCES `suppliers_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

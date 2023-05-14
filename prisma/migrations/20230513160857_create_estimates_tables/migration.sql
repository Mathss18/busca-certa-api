-- CreateTable
CREATE TABLE `estimates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientName` VARCHAR(191) NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientPhone` VARCHAR(191) NOT NULL,
    `clientCompanyName` VARCHAR(191) NOT NULL,
    `clientSegment` VARCHAR(191) NULL,
    `clientFile` VARCHAR(191) NULL,
    `clientMessage` TEXT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `estimateInfoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimates_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimateId` INTEGER NOT NULL,
    `sentClientEmail` DATETIME(3) NOT NULL,
    `sentSupplierEmail` DATETIME(3) NOT NULL,
    `sentClientWhatsapp` DATETIME(3) NOT NULL,
    `sentSupplierWhatsapp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimate_product_variations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimateId` INTEGER NOT NULL,
    `variationId` INTEGER NOT NULL,
    `variationOptionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estimates` ADD CONSTRAINT `estimates_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimates` ADD CONSTRAINT `estimates_estimateInfoId_fkey` FOREIGN KEY (`estimateInfoId`) REFERENCES `estimates_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_product_variations` ADD CONSTRAINT `estimate_product_variations_estimateId_fkey` FOREIGN KEY (`estimateId`) REFERENCES `estimates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_product_variations` ADD CONSTRAINT `estimate_product_variations_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_product_variations` ADD CONSTRAINT `estimate_product_variations_variationOptionId_fkey` FOREIGN KEY (`variationOptionId`) REFERENCES `variation_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

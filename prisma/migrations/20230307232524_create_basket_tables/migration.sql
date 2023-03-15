-- CreateTable
CREATE TABLE `baskets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `basket_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `basketId` INTEGER NOT NULL,
    `productsId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `itemNumber` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `basket_variations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `basketDetailsId` INTEGER NOT NULL,
    `variationsId` INTEGER NOT NULL,
    `variationsOptionsId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `basket_details` ADD CONSTRAINT `basket_details_basketId_fkey` FOREIGN KEY (`basketId`) REFERENCES `baskets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basket_details` ADD CONSTRAINT `basket_details_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basket_variations` ADD CONSTRAINT `basket_variations_basketDetailsId_fkey` FOREIGN KEY (`basketDetailsId`) REFERENCES `basket_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basket_variations` ADD CONSTRAINT `basket_variations_variationsId_fkey` FOREIGN KEY (`variationsId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basket_variations` ADD CONSTRAINT `basket_variations_variationsOptionsId_fkey` FOREIGN KEY (`variationsOptionsId`) REFERENCES `variations_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

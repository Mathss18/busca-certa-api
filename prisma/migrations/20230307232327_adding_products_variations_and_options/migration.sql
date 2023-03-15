-- CreateTable
CREATE TABLE `variations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variations_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `variationId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_variations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productsId` INTEGER NOT NULL,
    `variationsId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_variations_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productsVariationsId` INTEGER NOT NULL,
    `variationsOptionsId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `variations_options` ADD CONSTRAINT `variations_options_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_variations` ADD CONSTRAINT `products_variations_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_variations` ADD CONSTRAINT `products_variations_variationsId_fkey` FOREIGN KEY (`variationsId`) REFERENCES `variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_variations_options` ADD CONSTRAINT `products_variations_options_productsVariationsId_fkey` FOREIGN KEY (`productsVariationsId`) REFERENCES `products_variations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_variations_options` ADD CONSTRAINT `products_variations_options_variationsOptionsId_fkey` FOREIGN KEY (`variationsOptionsId`) REFERENCES `variations_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

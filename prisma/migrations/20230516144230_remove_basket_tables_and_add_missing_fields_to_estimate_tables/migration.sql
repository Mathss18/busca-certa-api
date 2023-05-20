/*
  Warnings:

  - You are about to drop the `basket_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `basket_variations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `baskets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `estimate_product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `estimates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `estimates_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `basket_details` DROP FOREIGN KEY `basket_details_basketId_fkey`;

-- DropForeignKey
ALTER TABLE `basket_details` DROP FOREIGN KEY `basket_details_productsId_fkey`;

-- DropForeignKey
ALTER TABLE `basket_variations` DROP FOREIGN KEY `basket_variations_basketDetailsId_fkey`;

-- DropForeignKey
ALTER TABLE `basket_variations` DROP FOREIGN KEY `basket_variations_variationsId_fkey`;

-- DropForeignKey
ALTER TABLE `basket_variations` DROP FOREIGN KEY `basket_variations_variationsOptionsId_fkey`;

-- AlterTable
ALTER TABLE `estimate_product_variations` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `estimates` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `estimates_info` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `basket_details`;

-- DropTable
DROP TABLE `basket_variations`;

-- DropTable
DROP TABLE `baskets`;

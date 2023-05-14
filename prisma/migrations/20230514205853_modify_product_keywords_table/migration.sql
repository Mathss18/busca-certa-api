/*
  Warnings:

  - You are about to drop the column `keywordsId` on the `product_keywords` table. All the data in the column will be lost.
  - Added the required column `keywordId` to the `product_keywords` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_keywords` DROP FOREIGN KEY `product_keywords_keywordsId_fkey`;

-- AlterTable
ALTER TABLE `product_keywords` DROP COLUMN `keywordsId`,
    ADD COLUMN `keywordId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product_keywords` ADD CONSTRAINT `product_keywords_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `keywords`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

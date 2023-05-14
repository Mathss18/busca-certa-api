-- DropForeignKey
ALTER TABLE `estimates` DROP FOREIGN KEY `estimates_estimateInfoId_fkey`;

-- AlterTable
ALTER TABLE `estimates` MODIFY `estimateInfoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `estimates` ADD CONSTRAINT `estimates_estimateInfoId_fkey` FOREIGN KEY (`estimateInfoId`) REFERENCES `estimates_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

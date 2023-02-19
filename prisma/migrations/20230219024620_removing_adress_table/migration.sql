/*
  Warnings:

  - You are about to drop the `adresses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `adresses` DROP FOREIGN KEY `adresses_supplierId_fkey`;

-- AlterTable
ALTER TABLE `suppliers` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(191) NOT NULL,
    ADD COLUMN `number` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL,
    ADD COLUMN `zipCode` VARCHAR(191) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `adresses`;

/*
  Warnings:

  - You are about to drop the column `shippingAreas` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `shippingAreas`,
    ADD COLUMN `actionAreas` JSON NULL;

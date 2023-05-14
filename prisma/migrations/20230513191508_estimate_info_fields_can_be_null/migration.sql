-- AlterTable
ALTER TABLE `estimates_info` MODIFY `sentClientEmail` DATETIME(3) NULL,
    MODIFY `sentSupplierEmail` DATETIME(3) NULL,
    MODIFY `sentClientWhatsapp` DATETIME(3) NULL,
    MODIFY `sentSupplierWhatsapp` DATETIME(3) NULL;

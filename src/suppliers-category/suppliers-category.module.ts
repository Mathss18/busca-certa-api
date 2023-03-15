import { Module } from '@nestjs/common';
import { SuppliersCategoryService } from './suppliers-category.service';
import { SuppliersCategoryController } from './suppliers-category.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SuppliersCategoryController],
  providers: [SuppliersCategoryService, PrismaService],
})
export class SuppliersCategoryModule {}

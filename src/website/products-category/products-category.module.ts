import { Module } from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoryController } from './products-category.controller';
import { PrismaService } from '../../database/prisma.service';
import { ProductsCategoryRepository } from './products-category.repository';

@Module({
  controllers: [ProductsCategoryController],
  providers: [ProductsCategoryService, ProductsCategoryRepository, PrismaService],
})
export class ProductsCategoryModule {}

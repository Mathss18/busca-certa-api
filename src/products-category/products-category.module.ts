import { Module } from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoryController } from './products-category.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ProductsCategoryController],
  providers: [ProductsCategoryService, PrismaService],
})
export class ProductsCategoryModule {}

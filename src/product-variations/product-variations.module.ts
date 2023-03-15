import { Module } from '@nestjs/common';
import { ProductVariationsService } from './product-variations.service';
import { ProductVariationsController } from './product-variations.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ProductVariationsController],
  providers: [ProductVariationsService, PrismaService],
})
export class ProductVariationsModule {}

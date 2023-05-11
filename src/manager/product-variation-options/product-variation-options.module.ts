import { Module } from '@nestjs/common';
import { ProductVariationOptionsService } from './product-variation-options.service';
import { ProductVariationOptionsController } from './product-variation-options.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ProductVariationOptionsController],
  providers: [ProductVariationOptionsService, PrismaService],
})
export class ProductVariationOptionsModule {}

import { Module } from '@nestjs/common';
import { VariationOptionsService } from './variation-options.service';
import { VariationOptionsController } from './variation-options.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [VariationOptionsController],
  providers: [VariationOptionsService, PrismaService],
})
export class VariationOptionsModule {}

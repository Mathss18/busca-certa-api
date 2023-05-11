import { Module } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [VariationsController],
  providers: [VariationsService, PrismaService],
})
export class VariationsModule {}

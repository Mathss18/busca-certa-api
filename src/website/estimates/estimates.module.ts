import { Module } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { EstimatesController } from './estimates.controller';
import { PrismaService } from '../../database/prisma.service';
import { EstimateRepository } from './estimate.repository';
import { EstimateListener } from './listeners/estimate.listener';

@Module({
  controllers: [EstimatesController],
  providers: [EstimatesService, PrismaService, EstimateRepository, EstimateListener],
})
export class EstimatesModule {}

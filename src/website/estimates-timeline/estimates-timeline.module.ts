import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EstimatesTimelineRepository } from './estimates-timeline.repository';
import { EstimateRepository } from '../estimates/estimate.repository';
import { EstimatesService } from '../estimates/estimates.service';

@Module({
  providers: [PrismaService, EstimatesTimelineRepository, EstimateRepository, EstimatesService],
  exports: [EstimatesTimelineRepository],
})
export class EstimatesTimelineModule {}

import { Module } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { EstimatesController } from './estimates.controller';
import { PrismaService } from '../../database/prisma.service';
import { EstimateRepository } from './estimate.repository';
import { EstimateCreatedListener } from './listeners/estimate-created.listener';
import { EstimatesTimelineService } from '../estimates-timeline/estimates-timeline.service';
import { EstimatesTimelineRepository } from '../estimates-timeline/estimates-timeline.repository';
import { EstimateAckListener } from './listeners/estimate-ack.listener';
import { EstimateAcceptedListener } from './listeners/estimate-accepted.listener';
import { EstimateDeclinedListener } from './listeners/estimate-declined.listener';

@Module({
  controllers: [EstimatesController],
  providers: [
    EstimatesService,
    PrismaService,
    EstimatesTimelineService,
    EstimateRepository,
    EstimatesTimelineRepository,
    EstimateCreatedListener,
    EstimateAckListener,
    EstimateAcceptedListener,
    EstimateDeclinedListener,
  ],
  exports: [EstimatesService, EstimateRepository],
})
export class EstimatesModule {}

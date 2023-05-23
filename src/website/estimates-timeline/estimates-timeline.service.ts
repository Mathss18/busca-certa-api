import { Injectable } from '@nestjs/common';
import { EstimatesTimelineRepository } from './estimates-timeline.repository';
import { EstimateTimelineCode } from './enum/estimate-timeline.enum';
import { CreateEstimateTimelineDto } from './dto/estimate-timeline.dto';

@Injectable()
export class EstimatesTimelineService {
  constructor(private readonly repository: EstimatesTimelineRepository) {}

  async create(params: CreateEstimateTimelineDto) {
    return await this.repository.create(params);
  }

  async ackEstimate(id: number) {
    const estimateTimeline = await this.repository.getAckEventInTimeline(id);

    /* If the estimate timeline already has the ack event, we just update the date */
    if (estimateTimeline) {
      return await this.repository.update(estimateTimeline.id, {
        code: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.CODE,
        message: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.MESSAGE,
        updatedAt: new Date(),
      });
    }

    /* If the estimate timeline doesn't have the ack event, we create it */
    return this.repository.create({
      estimateId: id,
      code: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.CODE,
      message: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.MESSAGE,
    });
  }
}

import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { EstimatesTimelineService } from '../../estimates-timeline/estimates-timeline.service';
import { EstimateAckEventType } from '../events/estimate-ack.event';

@Injectable()
export class EstimateAckListener {
  constructor(private readonly estimatesTimelineService: EstimatesTimelineService) {}

  @OnEvent('estimate.ack')
  async updateEstimateTimeline(event: EstimateAckEventType) {
    try {
      this.estimatesTimelineService.ackEstimate(event.estimateId);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.ack')
  async notifyClient(event: EstimateAckEventType) {
    console.log('Notifying client that supplier ack his estimate(NOT IMPLEMENTED)', event.estimateId);
  }
}

import { Injectable } from '@nestjs/common';
import { EstimateRepository } from './estimate.repository';
import { CreateEstimateDto } from './dto/estimate.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EstimateCreatedEvent } from './events/estimate-created.event';

@Injectable()
export class EstimatesService {
  constructor(private readonly repository: EstimateRepository, private eventEmitter: EventEmitter2) {}

  async create(params: CreateEstimateDto) {
    const estimate = await this.repository.create(params);
    this.eventEmitter.emit('estimate.created', new EstimateCreatedEvent({ estimateId: estimate.id }));
    return estimate;
  }
}

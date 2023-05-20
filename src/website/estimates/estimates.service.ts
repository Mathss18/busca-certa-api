import { Injectable } from '@nestjs/common';
import { EstimateRepository } from './estimate.repository';
import { AcceptEstimateDto, CreateEstimateDto, DeclineEstimateDto } from './dto/estimate.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EstimateCreatedEvent } from './events/estimate-created.event';
import { EstimateAckEvent } from './events/estimate-ack.event';
import { EstimateStatuses } from './enum/estimate-statuses.enum';
import { EstimateAcceptedEvent } from './events/estimate-accepted.event';
import { EstimateDeclinedEvent } from './events/estimate-declined.event';

@Injectable()
export class EstimatesService {
  constructor(private readonly repository: EstimateRepository, private eventEmitter: EventEmitter2) {}

  async create(params: CreateEstimateDto) {
    const estimate = await this.repository.create(params);
    this.eventEmitter.emit('estimate.created', new EstimateCreatedEvent({ estimateId: estimate.id }));
    return estimate;
  }

  async getOneByNonce(nonce: string) {
    return await this.repository.getOneByNonce(nonce);
  }

  async getIdByNonce(nonce: string) {
    return await this.repository.getIdByNonce(nonce);
  }

  async ackEstimate(nonce: string) {
    const { id } = await this.repository.getIdByNonce(nonce);
    this.eventEmitter.emit('estimate.ack', new EstimateAckEvent({ estimateId: id }));
    return 'ACK';
  }

  async accept(acceptEstimateDto: AcceptEstimateDto) {
    const { nonce, price } = acceptEstimateDto;
    const { id, status } = await this.repository.getOneByNonce(nonce);

    if (status !== EstimateStatuses.PENDING) throw new Error('Estimate is not pending');

    const estimate = await this.repository.accept(id, EstimateStatuses.ACCEPTED, price);
    this.eventEmitter.emit('estimate.accepted', new EstimateAcceptedEvent({ estimateId: id, price }));
    return estimate;
  }

  async decline(acceptEstimateDto: DeclineEstimateDto) {
    const { nonce, reason } = acceptEstimateDto;
    const { id, status } = await this.repository.getOneByNonce(nonce);

    if (status !== EstimateStatuses.PENDING) throw new Error('Estimate is not pending');

    const estimate = await this.repository.decline(id, EstimateStatuses.DECLINED);
    this.eventEmitter.emit('estimate.declined', new EstimateDeclinedEvent({ estimateId: id, reason }));
    return estimate;
  }
}

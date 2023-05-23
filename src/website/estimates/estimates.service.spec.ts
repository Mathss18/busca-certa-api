import { Test, TestingModule } from '@nestjs/testing';
import { EstimatesService } from './estimates.service';
import { EstimateRepository } from './estimate.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEstimateDto, AcceptEstimateDto, DeclineEstimateDto } from './dto/estimate.dto';
import { EstimateStatuses } from './enum/estimate-statuses.enum';
import { EstimateCreatedEvent } from './events/estimate-created.event';
import { EstimateAckEvent } from './events/estimate-ack.event';
import { EstimateAcceptedEvent } from './events/estimate-accepted.event';
import { EstimateDeclinedEvent } from './events/estimate-declined.event';

jest.mock('./estimate.repository');

describe('EstimatesService', () => {
  let service: EstimatesService;
  const mockRepository = {
    create: jest.fn(),
    getOneByNonce: jest.fn(),
    getIdByNonce: jest.fn(),
    accept: jest.fn(),
    decline: jest.fn(),
  };
  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstimatesService,
        { provide: EstimateRepository, useValue: mockRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<EstimatesService>(EstimatesService);
  });

  it('should create estimate', async () => {
    const params: CreateEstimateDto = {
      clientName: 'test',
      clientEmail: 'test@test.com',
      clientPhone: '123456789',
      clientCompanyName: 'test_company',
      productId: 1,
      quantity: 1,
    };
    const result = { id: 1, ...params };
    mockRepository.create.mockResolvedValue(result);

    expect(await service.create(params)).toEqual(result);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('estimate.created', new EstimateCreatedEvent({ estimateId: result.id }));
  });

  it('should get estimate by nonce', async () => {
    const nonce = 'test_nonce';
    const result = { id: 1, nonce };
    mockRepository.getOneByNonce.mockResolvedValue(result);

    expect(await service.getOneByNonce(nonce)).toEqual(result);
  });

  it('should get estimate id by nonce', async () => {
    const nonce = 'test_nonce';
    const result = { id: 1 };
    mockRepository.getIdByNonce.mockResolvedValue(result);

    expect(await service.getIdByNonce(nonce)).toEqual(result);
  });

  it('should acknowledge estimate', async () => {
    const nonce = 'test_nonce';
    const result = { id: 1 };
    mockRepository.getIdByNonce.mockResolvedValue(result);

    expect(await service.ackEstimate(nonce)).toEqual('ACK');
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('estimate.ack', new EstimateAckEvent({ estimateId: result.id }));
  });

  it('should accept estimate', async () => {
    const nonce = 'test_nonce';
    const price = 1000;
    const result = { id: 1, nonce, status: EstimateStatuses.PENDING };
    const params: AcceptEstimateDto = { nonce, price };
    mockRepository.getOneByNonce.mockResolvedValue(result);
    mockRepository.accept.mockResolvedValue({ ...result, status: EstimateStatuses.ACCEPTED });

    const estimate = await service.accept(params);
    expect(estimate.status).toEqual(EstimateStatuses.ACCEPTED);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('estimate.accepted', new EstimateAcceptedEvent({ estimateId: result.id, price }));
  });

  it('should decline estimate', async () => {
    const nonce = 'test_nonce';
    const reason = 'test_reason';
    const result = { id: 1, nonce, status: EstimateStatuses.PENDING };
    const params: DeclineEstimateDto = { nonce, reason };
    mockRepository.getOneByNonce.mockResolvedValue(result);
    mockRepository.decline.mockResolvedValue({ ...result, status: EstimateStatuses.DECLINED });

    const estimate = await service.decline(params);
    expect(estimate.status).toEqual(EstimateStatuses.DECLINED);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('estimate.declined', new EstimateDeclinedEvent({ estimateId: result.id, reason }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

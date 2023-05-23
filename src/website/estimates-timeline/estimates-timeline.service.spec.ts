import { Test, TestingModule } from '@nestjs/testing';
import { EstimatesTimelineService } from './estimates-timeline.service';
import { EstimatesTimelineRepository } from './estimates-timeline.repository';
import { CreateEstimateTimelineDto } from './dto/estimate-timeline.dto';
import { EstimateTimelineCode } from './enum/estimate-timeline.enum';

describe('EstimatesTimelineService', () => {
  let service: EstimatesTimelineService;
  let repository: jest.Mocked<Partial<EstimatesTimelineRepository>>;

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      update: jest.fn(),
      getAckEventInTimeline: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstimatesTimelineService,
        {
          provide: EstimatesTimelineRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<EstimatesTimelineService>(EstimatesTimelineService);
    repository = module.get<any>(EstimatesTimelineRepository); // use "any" to avoid TypeScript error
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create with correct params', async () => {
      const dto = new CreateEstimateTimelineDto();

      await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('ackEstimate', () => {
    it('should call repository.getAckEventInTimeline with correct params', async () => {
      const id = 1;

      await service.ackEstimate(id);

      expect(repository.getAckEventInTimeline).toHaveBeenCalledWith(id);
    });

    it('should call repository.update when ack event exists', async () => {
      const id = 1;
      repository.getAckEventInTimeline.mockResolvedValueOnce({
        id: 1,
        estimateId: 1,
        message: '',
        code: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.ackEstimate(id);

      expect(repository.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          code: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.CODE,
          message: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.MESSAGE,
        }),
      );
    });

    it('should call repository.create when ack event does not exist', async () => {
      const id = 1;
      repository.getAckEventInTimeline.mockResolvedValueOnce(null);

      await service.ackEstimate(id);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          estimateId: id,
          code: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.CODE,
          message: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.MESSAGE,
        }),
      );
    });
  });
});

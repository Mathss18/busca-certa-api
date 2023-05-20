import { Test, TestingModule } from '@nestjs/testing';
import { EstimatesTimelineService } from './estimates-timeline.service';

describe('EstimatesTimelineService', () => {
  let service: EstimatesTimelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstimatesTimelineService],
    }).compile();

    service = module.get<EstimatesTimelineService>(EstimatesTimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

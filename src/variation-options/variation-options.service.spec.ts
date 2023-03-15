import { Test, TestingModule } from '@nestjs/testing';
import { VariationOptionsService } from './variation-options.service';

describe('VariationOptionsService', () => {
  let service: VariationOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariationOptionsService],
    }).compile();

    service = module.get<VariationOptionsService>(VariationOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

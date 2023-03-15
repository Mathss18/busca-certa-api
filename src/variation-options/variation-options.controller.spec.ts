import { Test, TestingModule } from '@nestjs/testing';
import { VariationOptionsController } from './variation-options.controller';
import { VariationOptionsService } from './variation-options.service';

describe('VariationOptionsController', () => {
  let controller: VariationOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationOptionsController],
      providers: [VariationOptionsService],
    }).compile();

    controller = module.get<VariationOptionsController>(VariationOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

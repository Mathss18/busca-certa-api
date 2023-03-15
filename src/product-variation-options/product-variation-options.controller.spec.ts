import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationOptionsController } from './product-variation-options.controller';
import { ProductVariationOptionsService } from './product-variation-options.service';

describe('ProductVariationOptionsController', () => {
  let controller: ProductVariationOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationOptionsController],
      providers: [ProductVariationOptionsService],
    }).compile();

    controller = module.get<ProductVariationOptionsController>(ProductVariationOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

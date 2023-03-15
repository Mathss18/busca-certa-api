import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationOptionsService } from './product-variation-options.service';

describe('ProductVariationOptionsService', () => {
  let service: ProductVariationOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariationOptionsService],
    }).compile();

    service = module.get<ProductVariationOptionsService>(ProductVariationOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

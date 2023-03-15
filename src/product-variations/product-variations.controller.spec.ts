import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationsController } from './product-variations.controller';
import { ProductVariationsService } from './product-variations.service';

describe('ProductVariationsController', () => {
  let controller: ProductVariationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationsController],
      providers: [ProductVariationsService],
    }).compile();

    controller = module.get<ProductVariationsController>(ProductVariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

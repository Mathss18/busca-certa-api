import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ProductVariationOptionsController } from './product-variation-options.controller';
import { ProductVariationOptionsService } from './product-variation-options.service';

describe('ProductVariationOptionsController', () => {
  let controller: ProductVariationOptionsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const productVariationOptions = {
    id: 1,
    productVariationId: 1,
    variationOptionId: 1,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  };

  const modifiedProductVariationOptions = {
    ...productVariationOptions,
    variationOptionId: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationOptionsController],
      providers: [
        ProductVariationOptionsService,
        {
          provide: ProductVariationOptionsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productVariationOptions]),
            findOne: jest.fn().mockResolvedValue(productVariationOptions),
            create: jest.fn().mockResolvedValue(productVariationOptions),
            update: jest.fn().mockResolvedValue(modifiedProductVariationOptions),
            remove: jest.fn().mockResolvedValue(productVariationOptions),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductVariationOptionsController>(ProductVariationOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all product variation options', () => {
    it('should return an array of product variation options', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [productVariationOptions],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a product variatios option', () => {
    it('should return a product variatios option', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: productVariationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a product variatios option', () => {
    it('should create a product variatios option', async () => {
      const result: any = await controller.create(productVariationOptions, res);
      expect(result).toStrictEqual({
        data: productVariationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a product variatios option', () => {
    it('should update a product variatios option', async () => {
      const result: any = await controller.update('1', modifiedProductVariationOptions, res);
      expect(result).toStrictEqual({
        data: modifiedProductVariationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a product variatios option', () => {
    it('should remove a product variatios option', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: productVariationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

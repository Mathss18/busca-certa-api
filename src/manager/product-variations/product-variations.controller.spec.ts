import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ProductVariationsController } from './product-variations.controller';
import { ProductVariationsService } from './product-variations.service';

describe('ProductVariationsController', () => {
  let controller: ProductVariationsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const productVariation = {
    id: 1,
    productId: 1,
    variationId: 1,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  };

  const modifiedProductVariation = {
    ...productVariation,
    variationId: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationsController],
      providers: [
        ProductVariationsService,
        {
          provide: ProductVariationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productVariation]),
            findOne: jest.fn().mockResolvedValue(productVariation),
            create: jest.fn().mockResolvedValue(productVariation),
            update: jest.fn().mockResolvedValue(modifiedProductVariation),
            remove: jest.fn().mockResolvedValue(productVariation),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductVariationsController>(ProductVariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all product variation', () => {
    it('should return an array of product variation ', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [productVariation],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a product variations option', () => {
    it('should return a product variations option', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: productVariation,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a product variations option', () => {
    it('should create a product variations option', async () => {
      const result: any = await controller.create(productVariation, res);
      expect(result).toStrictEqual({
        data: productVariation,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a product variations option', () => {
    it('should update a product variations option', async () => {
      const result: any = await controller.update('1', modifiedProductVariation, res);
      expect(result).toStrictEqual({
        data: modifiedProductVariation,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a product variations option', () => {
    it('should remove a product variations option', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: productVariation,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

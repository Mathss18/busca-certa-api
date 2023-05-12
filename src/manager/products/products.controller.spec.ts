import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const products = {
    id: 2,
    name: 'Caneta',
    description: 'Caneta Bic bonita',
    subtitle: 'Azul',
    brand: 'Bic',
    rating: 5,
    image: null,
    price: 1.99,
    priceUpdatedAt: new Date(),
    supplierId: 1,
    productCategoryId: 2,
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  };

  const modifiedProducts = {
    ...products,
    variationOptionId: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([products]),
            findOne: jest.fn().mockResolvedValue(products),
            create: jest.fn().mockResolvedValue(products),
            update: jest.fn().mockResolvedValue(modifiedProducts),
            remove: jest.fn().mockResolvedValue(products),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all product variation options', () => {
    it('should return an array of product variation options', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [products],
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
        data: products,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a product variatios option', () => {
    it('should create a product variatios option', async () => {
      const result: any = await controller.create(products, res);
      expect(result).toStrictEqual({
        data: products,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a product variatios option', () => {
    it('should update a product variatios option', async () => {
      const result: any = await controller.update('1', modifiedProducts, res);
      expect(result).toStrictEqual({
        data: modifiedProducts,
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
        data: products,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

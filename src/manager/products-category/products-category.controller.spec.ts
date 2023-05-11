import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ProductsCategoryController } from './products-category.controller';
import { ProductsCategoryService } from './products-category.service';

describe('ProductsCartegoryController', () => {
  let controller: ProductsCategoryController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const productCategoryMock = {
    id: 1,
    name: 'Bolas',
    parentId: null,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  };

  const modifiedProductCategory = {
    ...productCategoryMock,
    name: 'Roupas',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsCategoryController],
      providers: [
        ProductsCategoryService,
        {
          provide: ProductsCategoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productCategoryMock]),
            findOne: jest.fn().mockResolvedValue(productCategoryMock),
            create: jest.fn().mockResolvedValue(productCategoryMock),
            update: jest.fn().mockResolvedValue(modifiedProductCategory),
            remove: jest.fn().mockResolvedValue(productCategoryMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsCategoryController>(
      ProductsCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all products category', () => {
    it('should return an array of products category', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [productCategoryMock],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a product category', () => {
    it('should return a product category', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: productCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a product category', () => {
    it('should create a product category', async () => {
      const result: any = await controller.create(productCategoryMock, res);
      expect(result).toStrictEqual({
        data: productCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a product category', () => {
    it('should update a product category', async () => {
      const result: any = await controller.update(
        '1',
        modifiedProductCategory,
        res,
      );
      expect(result).toStrictEqual({
        data: modifiedProductCategory,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a product category', () => {
    it('should remove a product category', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: productCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

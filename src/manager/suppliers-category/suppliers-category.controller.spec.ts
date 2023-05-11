import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { SuppliersCategoryController } from './suppliers-category.controller';
import { SuppliersCategoryService } from './suppliers-category.service';

describe('SuppliersCartegoryController', () => {
  let controller: SuppliersCategoryController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const supplierCategoryMock = {
    id: 1,
    name: 'Bolas',
    parentId: null,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  };

  const modifiedSupplierCategory = {
    ...supplierCategoryMock,
    name: 'Roupas',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersCategoryController],
      providers: [
        SuppliersCategoryService,
        {
          provide: SuppliersCategoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([supplierCategoryMock]),
            findOne: jest.fn().mockResolvedValue(supplierCategoryMock),
            create: jest.fn().mockResolvedValue(supplierCategoryMock),
            update: jest.fn().mockResolvedValue(modifiedSupplierCategory),
            remove: jest.fn().mockResolvedValue(supplierCategoryMock),
          },
        },
      ],
    }).compile();

    controller = module.get<SuppliersCategoryController>(
      SuppliersCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all suppliers category', () => {
    it('should return an array of suppliers category', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [supplierCategoryMock],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a supplier category', () => {
    it('should return a supplier category', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: supplierCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a supplier category', () => {
    it('should create a supplier category', async () => {
      const result: any = await controller.create(supplierCategoryMock, res);
      expect(result).toStrictEqual({
        data: supplierCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a supplier category', () => {
    it('should update a supplier category', async () => {
      const result: any = await controller.update(
        '1',
        modifiedSupplierCategory,
        res,
      );
      expect(result).toStrictEqual({
        data: modifiedSupplierCategory,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a supplier category', () => {
    it('should remove a supplier category', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: supplierCategoryMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { VariationOptionsController } from './variation-options.controller';
import { VariationOptionsService } from './variation-options.service';

describe('VariationOptionsController', () => {
  let controller: VariationOptionsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const variationOptions = {
    id: 1,
    name: 'Vermelho',
    variationId: 1,
    active: true,
    createdAt: '2023-03-09T23:04:22.115Z',
    updatedAt: '2023-03-09T23:04:22.115Z',
  };

  const modifiedVariationOptions = {
    ...variationOptions,
    name: 'Azul',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationOptionsController],
      providers: [
        {
          provide: VariationOptionsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([variationOptions]),
            findOne: jest.fn().mockResolvedValue(variationOptions),
            create: jest.fn().mockResolvedValue(variationOptions),
            update: jest.fn().mockResolvedValue(modifiedVariationOptions),
            remove: jest.fn().mockResolvedValue(variationOptions),
          },
        },
      ],
    }).compile();

    controller = module.get<VariationOptionsController>(
      VariationOptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all variationOptions variation options', () => {
    it('should return an array of variationOptions variation options', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [variationOptions],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a variatios option', () => {
    it('should return a variatios option', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: variationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a variatios option', () => {
    it('should create a variatios option', async () => {
      const result: any = await controller.create(variationOptions, res);
      expect(result).toStrictEqual({
        data: variationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a variatios option', () => {
    it('should update a variatios option', async () => {
      const result: any = await controller.update(
        '1',
        modifiedVariationOptions,
        res,
      );
      expect(result).toStrictEqual({
        data: modifiedVariationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a variatios option', () => {
    it('should remove a variatios option', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: variationOptions,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

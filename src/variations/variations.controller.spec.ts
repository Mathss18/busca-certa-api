import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { VariationsController } from './variations.controller';
import { VariationsService } from './variations.service';

describe('VariationsController', () => {
  let controller: VariationsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const variations = {
    id: 1,
    name: 'Cor',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  };

  const modifiedVariations = {
    ...variations,
    name: 'Tamanho',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsController],
      providers: [
        {
          provide: VariationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([variations]),
            findOne: jest.fn().mockResolvedValue(variations),
            create: jest.fn().mockResolvedValue(variations),
            update: jest.fn().mockResolvedValue(modifiedVariations),
            remove: jest.fn().mockResolvedValue(variations),
          },
        },
      ],
    }).compile();

    controller = module.get<VariationsController>(VariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all variations variation options', () => {
    it('should return an array of variations variation options', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [variations],
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
        data: variations,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a variatios option', () => {
    it('should create a variatios option', async () => {
      const result: any = await controller.create(variations, res);
      expect(result).toStrictEqual({
        data: variations,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a variatios option', () => {
    it('should update a variatios option', async () => {
      const result: any = await controller.update('1', modifiedVariations, res);
      expect(result).toStrictEqual({
        data: modifiedVariations,
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
        data: variations,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';

describe('KeywordsController', () => {
  let controller: KeywordsController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const keywords = {
    id: 1,
    name: 'bolas',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  };

  const modifiedKeywords = {
    ...keywords,
    name: 'molas',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeywordsController],
      providers: [
        {
          provide: KeywordsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([keywords]),
            findOne: jest.fn().mockResolvedValue(keywords),
            create: jest.fn().mockResolvedValue(keywords),
            update: jest.fn().mockResolvedValue(modifiedKeywords),
            remove: jest.fn().mockResolvedValue(keywords),
          },
        },
      ],
    }).compile();

    controller = module.get<KeywordsController>(KeywordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all keywords', () => {
    it('should return an array of keywords', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [keywords],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a keyword', () => {
    it('should return a keyword', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: keywords,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a keyword', () => {
    it('should create a keyword', async () => {
      const result: any = await controller.create(keywords, res);
      expect(result).toStrictEqual({
        data: keywords,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a keyword', () => {
    it('should update a keyword', async () => {
      const result: any = await controller.update('1', modifiedKeywords, res);
      expect(result).toStrictEqual({
        data: modifiedKeywords,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a keyword', () => {
    it('should remove a keyword', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: keywords,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

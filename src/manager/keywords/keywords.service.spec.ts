import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsService } from './keywords.service';
import { PrismaService } from '../../database/prisma.service';

const keywordsArray = [
  {
    id: 1,
    name: 'bolas',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  },
  {
    id: 2,
    name: 'molas',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  },
];

const keyword = keywordsArray[0];
const keywordModified = {
  ...keyword,
  name: 'cordas',
};

describe('KeywordsService', () => {
  let service: KeywordsService;
  let prisma: PrismaService;

  const db = {
    keywords: {
      findMany: jest.fn().mockResolvedValue(keywordsArray),
      findFirst: jest.fn().mockResolvedValue(keyword),
      create: jest.fn().mockResolvedValue(keyword),
      update: jest.fn().mockResolvedValue(keywordModified),
      delete: jest.fn().mockResolvedValue(keyword),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of keywords', async () => {
      expect(await service.findAll()).toEqual(keywordsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single keywords', () => {
      expect(service.findOne(1)).resolves.toEqual(keyword);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a keywords', () => {
      expect(service.create(keyword)).resolves.toEqual(keyword);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const keywords = await service.update(1, keywordModified);
      expect(keywords).toEqual(keywordModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a keywords', () => {
      expect(service.remove(1)).resolves.toEqual(keyword);
    });
  });
});

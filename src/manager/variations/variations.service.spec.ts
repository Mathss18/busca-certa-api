import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { VariationsService } from './variations.service';

const variationsArray = [
  {
    id: 1,
    name: 'Cor',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  },
  {
    id: 1,
    name: 'Tamanho',
    active: true,
    createdAt: '2023-03-09T22:10:17.007Z',
    updatedAt: '2023-03-09T22:10:17.007Z',
  },
];

const variation = variationsArray[0];
const variationModified = {
  ...variation,
  name: 'Peso',
};

describe('VariationsService', () => {
  let service: VariationsService;
  let prisma: PrismaService;

  const db = {
    variations: {
      findMany: jest.fn().mockResolvedValue(variationsArray),
      findFirst: jest.fn().mockResolvedValue(variation),
      create: jest.fn().mockResolvedValue(variation),
      update: jest.fn().mockResolvedValue(variationModified),
      delete: jest.fn().mockResolvedValue(variation),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariationsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<VariationsService>(VariationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of variations', async () => {
      expect(await service.findAll()).toEqual(variationsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single variations', () => {
      expect(service.findOne(1)).resolves.toEqual(variation);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a variations', () => {
      expect(service.create(variation)).resolves.toEqual(variation);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const variations = await service.update(1, variationModified);
      expect(variations).toEqual(variationModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a variations', () => {
      expect(service.remove(1)).resolves.toEqual(variation);
    });
  });
});

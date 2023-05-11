import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { VariationOptionsService } from './variation-options.service';

const variationOptionsArray = [
  {
    id: 1,
    name: 'Vermelho',
    variationId: 1,
    active: true,
    createdAt: '2023-03-09T23:04:22.115Z',
    updatedAt: '2023-03-09T23:04:22.115Z',
  },
  {
    id: 2,
    name: 'Azul',
    variationId: 1,
    active: true,
    createdAt: '2023-03-09T23:04:28.712Z',
    updatedAt: '2023-03-09T23:04:28.712Z',
  },
];

const variationOption = variationOptionsArray[0];
const variationOptionModified = {
  ...variationOption,
  variationOptionId: 3,
};

describe('VariationOptionsService', () => {
  let service: VariationOptionsService;
  let prisma: PrismaService;

  const db = {
    variationOptions: {
      findMany: jest.fn().mockResolvedValue(variationOptionsArray),
      findFirst: jest.fn().mockResolvedValue(variationOption),
      create: jest.fn().mockResolvedValue(variationOption),
      update: jest.fn().mockResolvedValue(variationOptionModified),
      delete: jest.fn().mockResolvedValue(variationOption),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariationOptionsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<VariationOptionsService>(VariationOptionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of variationOptions', async () => {
      expect(await service.findAll()).toEqual(variationOptionsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single variationOptions', () => {
      expect(service.findOne(1)).resolves.toEqual(variationOption);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a variationOptions', () => {
      expect(service.create(variationOption)).resolves.toEqual(variationOption);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const variationOptions = await service.update(1, variationOptionModified);
      expect(variationOptions).toEqual(variationOptionModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a variationOptions', () => {
      expect(service.remove(1)).resolves.toEqual(variationOption);
    });
  });
});

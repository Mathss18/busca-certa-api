import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { ProductVariationsService } from './product-variations.service';

const productVariationsArray = [
  {
    id: 1,
    productId: 1,
    variationId: 1,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
  {
    id: 2,
    productId: 1,
    variationId: 2,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
];

const oneProductVariations = productVariationsArray[0];
const oneProductVariationsModified = {
  ...oneProductVariations,
  variationId: 3,
};

describe('ProductVariationsService', () => {
  let service: ProductVariationsService;
  let prisma: PrismaService;

  const db = {
    productVariations: {
      findMany: jest.fn().mockResolvedValue(productVariationsArray),
      findFirst: jest.fn().mockResolvedValue(oneProductVariations),
      create: jest.fn().mockResolvedValue(oneProductVariations),
      update: jest.fn().mockResolvedValue(oneProductVariationsModified),
      delete: jest.fn().mockResolvedValue(oneProductVariations),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariationsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ProductVariationsService>(ProductVariationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of productVariations', async () => {
      expect(await service.findAll()).toEqual(productVariationsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single productVariations', () => {
      expect(service.findOne(1)).resolves.toEqual(oneProductVariations);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a productVariations', () => {
      expect(service.create(oneProductVariations)).resolves.toEqual(
        oneProductVariations,
      );
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const productVariations = await service.update(
        1,
        oneProductVariationsModified,
      );
      expect(productVariations).toEqual(oneProductVariationsModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a productVariations', () => {
      expect(service.remove(1)).resolves.toEqual(oneProductVariations);
    });
  });
});

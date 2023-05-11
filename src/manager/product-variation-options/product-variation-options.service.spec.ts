import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { ProductVariationOptionsService } from './product-variation-options.service';

const productVariationOptionsArray = [
  {
    id: 1,
    productVariationId: 1,
    variationOptionId: 1,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
  {
    id: 2,
    productVariationId: 1,
    variationOptionId: 2,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
];

const oneProductVariationOptions = productVariationOptionsArray[0];
const oneProductVariationOptionsModified = {
  ...oneProductVariationOptions,
  variationOptionId: 3,
};

describe('ProductVariationOptionsService', () => {
  let service: ProductVariationOptionsService;
  let prisma: PrismaService;

  const db = {
    productVariationOptions: {
      findMany: jest.fn().mockResolvedValue(productVariationOptionsArray),
      findFirst: jest.fn().mockResolvedValue(oneProductVariationOptions),
      create: jest.fn().mockResolvedValue(oneProductVariationOptions),
      update: jest.fn().mockResolvedValue(oneProductVariationOptionsModified),
      delete: jest.fn().mockResolvedValue(oneProductVariationOptions),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariationOptionsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ProductVariationOptionsService>(
      ProductVariationOptionsService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of productVariationOptions', async () => {
      expect(await service.findAll()).toEqual(productVariationOptionsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single productVariationOptions', () => {
      expect(service.findOne(1)).resolves.toEqual(oneProductVariationOptions);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a productVariationOptions', () => {
      expect(service.create(oneProductVariationOptions)).resolves.toEqual(
        oneProductVariationOptions,
      );
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const productVariationOptions = await service.update(
        1,
        oneProductVariationOptionsModified,
      );
      expect(productVariationOptions).toEqual(
        oneProductVariationOptionsModified,
      );
    });
  });

  describe('deleteOne', () => {
    it('should dlete a productVariationOptions', () => {
      expect(service.remove(1)).resolves.toEqual(oneProductVariationOptions);
    });
  });
});

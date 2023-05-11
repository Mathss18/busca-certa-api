import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { ProductsCategoryService } from './products-category.service';

const productsCategoryArray = [
  {
    id: 1,
    name: 'Bolas',
    parentId: null,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
  {
    id: 2,
    name: 'Roupas',
    parentId: null,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
];

const oneProductCategory = productsCategoryArray[0];
const oneProductModified = {
  ...oneProductCategory,
  name: 'Calçados',
};

describe('ProductsCategoryService', () => {
  let service: ProductsCategoryService;
  let prisma: PrismaService;

  const db = {
    productsCategory: {
      findMany: jest.fn().mockResolvedValue(productsCategoryArray),
      findFirst: jest.fn().mockResolvedValue(oneProductCategory),
      create: jest.fn().mockResolvedValue(oneProductCategory),
      update: jest.fn().mockResolvedValue(oneProductModified),
      delete: jest.fn().mockResolvedValue(oneProductCategory),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCategoryService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ProductsCategoryService>(ProductsCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of productsCategory', async () => {
      const productsCategory = await service.findAll();
      expect(productsCategory).toEqual(productsCategoryArray);
    });
  });

  describe('getOne', () => {
    it('should get a single productsCategory', () => {
      expect(service.findOne(1)).resolves.toEqual(oneProductCategory);
    });
  });

  describe('insertOne', () => {
    it('should insert a productsCategory', () => {
      expect(service.create(oneProductCategory)).resolves.toEqual(
        oneProductCategory,
      );
    });
  });

  describe('updateOne', () => {
    it('should update a productsCategory', async () => {
      const productsCategory = await service.update(1, oneProductModified);
      expect(productsCategory).toEqual(oneProductModified);
    });
  });

  describe('deleteOne', () => {
    it('should delete a productsCtegory', () => {
      expect(service.remove(1)).resolves.toEqual(oneProductCategory);
    });
  });
});

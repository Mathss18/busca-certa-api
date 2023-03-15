import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { SuppliersCategoryService } from './suppliers-category.service';

const suppliersCategoryArray = [
  {
    id: 1,
    name: 'Bolas',
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
  {
    id: 2,
    name: 'Roupas',
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  },
];

const oneSupplierCategory = suppliersCategoryArray[0];
const oneSupplierModified = {
  ...oneSupplierCategory,
  name: 'Calçados',
};

describe('SuppliersCategoryService', () => {
  let service: SuppliersCategoryService;
  let prisma: PrismaService;

  const db = {
    suppliersCategory: {
      findMany: jest.fn().mockResolvedValue(suppliersCategoryArray),
      findFirst: jest.fn().mockResolvedValue(oneSupplierCategory),
      create: jest.fn().mockResolvedValue(oneSupplierCategory),
      update: jest.fn().mockResolvedValue(oneSupplierModified),
      delete: jest.fn().mockResolvedValue(oneSupplierCategory),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersCategoryService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<SuppliersCategoryService>(SuppliersCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of suppliersCategory', async () => {
      const suppliersCategory = await service.findAll();
      expect(suppliersCategory).toEqual(suppliersCategoryArray);
    });
  });

  describe('getOne', () => {
    it('should get a single suppliersCategory', () => {
      expect(service.findOne(1)).resolves.toEqual(oneSupplierCategory);
    });
  });

  describe('insertOne', () => {
    it('should insert a suppliersCategory', () => {
      expect(service.create(oneSupplierCategory)).resolves.toEqual(
        oneSupplierCategory,
      );
    });
  });

  describe('updateOne', () => {
    it('should update a suppliersCategory', async () => {
      const suppliersCategory = await service.update(1, oneSupplierModified);
      expect(suppliersCategory).toEqual(oneSupplierModified);
    });
  });

  describe('deleteOne', () => {
    it('should delete a suppliersCtegory', () => {
      expect(service.remove(1)).resolves.toEqual(oneSupplierCategory);
    });
  });
});

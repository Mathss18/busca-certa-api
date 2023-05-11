import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { ProductsService } from './products.service';

const productsArray = [
  {
    id: 1,
    name: 'Caneta',
    description: 'Caneta Bic bonita',
    sku: '123456789',
    image: null,
    price: 1.99,
    priceUpdatedAt: new Date(),
    supplierId: 1,
    productCategoryId: 2,
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  },
  {
    id: 2,
    name: 'Bola',
    description: 'Bola quadrada bonita',
    sku: '25799625',
    image: null,
    price: 1.99,
    priceUpdatedAt: new Date(),
    supplierId: 1,
    productCategoryId: 2,
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  },
];

const oneProduct = productsArray[0];
const oneProductModified = {
  ...oneProduct,
  variationOptionId: 3,
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const db = {
    products: {
      findMany: jest.fn().mockResolvedValue(productsArray),
      findFirst: jest.fn().mockResolvedValue(oneProduct),
      create: jest.fn().mockResolvedValue(oneProduct),
      update: jest.fn().mockResolvedValue(oneProductModified),
      delete: jest.fn().mockResolvedValue(oneProduct),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      expect(await service.findAll()).toEqual(productsArray);
    });
  });

  describe('getOne', () => {
    it('should get a single products', () => {
      expect(service.findOne(1)).resolves.toEqual(oneProduct);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a products', () => {
      expect(service.create(oneProduct)).resolves.toEqual(oneProduct);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const products = await service.update(1, oneProductModified);
      expect(products).toEqual(oneProductModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a products', () => {
      expect(service.remove(1)).resolves.toEqual(oneProduct);
    });
  });
});

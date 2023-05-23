import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const product = {
    id: 1,
    name: 'Bola',
    subtitle: 'sub',
    description: '<p>desc</p>',
    brand: 'marca',
    image: 'https://busca-certa-bucket.s3.sa-east-1.amazonaws.com/Bola-10-product.png',
    rating: 5,
    minimumToEstimate: 1,
    price: 0,
    priceUpdatedAt: new Date(),
    supplierId: 10,
    productCategoryId: 1,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      name: 'test',
      subtitle: 'test subtitle',
      description: '<p>desc</p>',
      brand: 'test brand',
      price: 10,
      priceUpdatedAt: new Date(),
      minimumToEstimate: 1,
      supplierId: 1,
      productCategoryId: 1,
      productFeatures: [1],
      productKeywords: [1],
      active: true,
    };

    jest.spyOn(prisma.products, 'create').mockResolvedValue(product);

    expect(await service.create(dto)).toEqual(product);
    expect(prisma.products.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should find all products', async () => {
    const expectedResult = [product];

    jest.spyOn(prisma.products, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one product with variations', async () => {
    const expectedResult = product;

    jest.spyOn(prisma.products, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOneWithVariations(1)).toEqual(expectedResult);
    expect(prisma.products.findFirst).toHaveBeenCalledWith({
      include: {
        productsVariations: {
          select: {
            active: true,
            id: true,
            variation: {
              select: {
                active: true,
                id: true,
                name: true,
                variationsOptions: {
                  select: {
                    active: true,
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: { id: 1 },
    });
  });

  it('should find one product with variations and variation options', async () => {
    const expectedResult = product;

    jest.spyOn(prisma.products, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOneWithVariationsAndVariationOptions(1)).toEqual(expectedResult);
    expect(prisma.products.findFirst).toHaveBeenCalledWith({
      include: {
        productsVariations: {
          include: {
            variation: {
              include: {
                variationsOptions: {
                  orderBy: {
                    id: 'desc',
                  },
                  select: {
                    id: true,
                    name: true,
                    productsVariationOptions: {
                      select: {
                        id: true,
                      },
                      where: {
                        productVariation: {
                          productId: 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: { id: 1 },
    });
  });

  it('should find one product', async () => {
    const expectedResult = product;

    jest.spyOn(prisma.products, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.products.findFirst).toHaveBeenCalledWith({
      include: {
        productFeatures: {
          select: {
            features: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        productKeywords: {
          select: {
            keywords: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: { id: 1 },
    });
  });

  // it('should update a product', async () => {
  //   const dto: UpdateProductDto = {
  //     name: 'updated',
  //     subtitle: 'updated subtitle',
  //     description: 'updated description',
  //     active: false,
  //     brand: 'updated brand',
  //     minimumToEstimate: 2,
  //     price: 20,
  //     priceUpdatedAt: new Date(),
  //     productCategoryId: 1,
  //     productFeatures: [1],
  //     productKeywords: [1],
  //     supplierId: 1,
  //   };

  //   const expectedResult = {
  //     id: 1,
  //     name: 'updated',
  //     subtitle: 'updated subtitle',
  //     description: 'updated description',
  //     active: false,
  //     brand: 'updated brand',
  //     minimumToEstimate: 2,
  //     price: 20,
  //     priceUpdatedAt: new Date(),
  //     productCategoryId: 1,
  //     productFeatures: [1],
  //     productKeywords: [1],
  //     supplierId: 1,
  //     image: 'https://busca-certa-bucket.s3.sa-east-1.amazonaws.com/Bola-10-product.png',
  //     rating: 5,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   jest.spyOn(prisma.products, 'update').mockResolvedValue(expectedResult);

  //   expect(await service.update(1, dto)).toEqual(expectedResult);
  //   expect(prisma.products.update).toHaveBeenCalledWith({
  //     where: { id: 1 },
  //     data: dto,
  //   });
  // });

  it('should remove a product', async () => {
    const expectedResult = product;

    jest.spyOn(prisma.products, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.products.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

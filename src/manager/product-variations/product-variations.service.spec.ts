import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationsService } from './product-variations.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

describe('ProductVariationsService', () => {
  let service: ProductVariationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariationsService, PrismaService],
    }).compile();

    service = module.get<ProductVariationsService>(ProductVariationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product variation', async () => {
    const dto: CreateProductVariationDto = {
      productId: 1,
      variationId: 1,
      active: true,
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariations, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.productVariations, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.productVariations.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should fail to create a duplicate product variation', async () => {
    const dto: CreateProductVariationDto = {
      productId: 1,
      variationId: 1,
      active: true,
    };

    const duplicateResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariations, 'findFirst').mockResolvedValue(duplicateResult);

    await expect(service.create(dto)).rejects.toThrow('Cannot link the same variation option twice.');
  });

  it('should find all product variations', async () => {
    const expectedResult = [{ id: 1, productId: 1, variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() }];

    jest.spyOn(prisma.productVariations, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one product variation', async () => {
    const expectedResult = { id: 1, productId: 1, variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariations, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.productVariations.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a product variation', async () => {
    const dto: UpdateProductVariationDto = {
      productId: 2,
      variationId: 2,
      active: false,
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariations, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.productVariations.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a product variation', async () => {
    const expectedResult = { id: 1, productId: 1, variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariations, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.productVariations.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

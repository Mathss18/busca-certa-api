import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationOptionsService } from './product-variation-options.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductVariationOptionDto } from './dto/create-product-variation-option.dto';
import { UpdateProductVariationOptionDto } from './dto/update-product-variation-option.dto';

describe('ProductVariationOptionsService', () => {
  let service: ProductVariationOptionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariationOptionsService, PrismaService],
    }).compile();

    service = module.get<ProductVariationOptionsService>(ProductVariationOptionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product variation option', async () => {
    const dto: CreateProductVariationOptionDto = {
      productVariationId: 1,
      variationOptionId: 1,
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariationOptions, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.productVariationOptions, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.productVariationOptions.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should fail to create a duplicate product variation option', async () => {
    const dto: CreateProductVariationOptionDto = {
      productVariationId: 1,
      variationOptionId: 1,
    };

    const duplicateResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariationOptions, 'findFirst').mockResolvedValue(duplicateResult);

    await expect(service.create(dto)).rejects.toThrow('Cannot link the same variation option twice.');
  });

  it('should find all product variation options', async () => {
    const expectedResult = [
      { id: 1, productVariationId: 1, variationOptionId: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    jest.spyOn(prisma.productVariationOptions, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one product variation option', async () => {
    const expectedResult = {
      id: 1,
      productVariationId: 1,
      variationOptionId: 1,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.productVariationOptions, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.productVariationOptions.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a product variation option', async () => {
    const dto: UpdateProductVariationOptionDto = {
      productVariationId: 2,
      variationOptionId: 2,
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.productVariationOptions, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.productVariationOptions.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a product variation option', async () => {
    const expectedResult = {
      id: 1,
      productVariationId: 1,
      variationOptionId: 1,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.productVariationOptions, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.productVariationOptions.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

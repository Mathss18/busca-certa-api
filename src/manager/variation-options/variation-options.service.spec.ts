import { Test, TestingModule } from '@nestjs/testing';
import { VariationOptionsService } from './variation-options.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateVariationOptionDto } from './dto/create-variation-option.dto';
import { UpdateVariationOptionDto } from './dto/update-variation-option.dto';

describe('VariationOptionsService', () => {
  let service: VariationOptionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariationOptionsService, PrismaService],
    }).compile();

    service = module.get<VariationOptionsService>(VariationOptionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a variation option', async () => {
    const dto: CreateVariationOptionDto = { name: 'test', variationId: 1 };
    const expectedResult = { id: 1, name: 'test', variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variationOptions, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.variationOptions.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should find all variation options', async () => {
    const expectedResult = [
      { id: 1, name: 'test1', variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'test2', variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    jest.spyOn(prisma.variationOptions, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one variation option', async () => {
    const expectedResult = { id: 1, name: 'test', variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variationOptions, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.variationOptions.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a variation option', async () => {
    const dto: UpdateVariationOptionDto = { name: 'updated', variationId: 1, active: false };
    const expectedResult = { id: 1, name: 'updated', variationId: 1, active: false, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variationOptions, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.variationOptions.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a variation option', async () => {
    const expectedResult = { id: 1, name: 'test', variationId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variationOptions, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.variationOptions.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

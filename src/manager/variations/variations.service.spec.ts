import { Test, TestingModule } from '@nestjs/testing';
import { VariationsService } from './variations.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';

describe('VariationsService', () => {
  let service: VariationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariationsService, PrismaService],
    }).compile();

    service = module.get<VariationsService>(VariationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a variation', async () => {
    const dto: CreateVariationDto = { name: 'test', active: true };
    const expectedResult = { id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variations, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.variations.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should find all variations', async () => {
    const expectedResult = [
      { id: 1, name: 'test1', active: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'test2', active: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    jest.spyOn(prisma.variations, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one variation', async () => {
    const expectedResult = { id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variations, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.variations.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { variationsOptions: true },
    });
  });

  it('should update a variation', async () => {
    const dto: UpdateVariationDto = { name: 'updated', active: false };
    const expectedResult = { id: 1, name: 'updated', active: false, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variations, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.variations.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a variation', async () => {
    const expectedResult = { id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.variations, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.variations.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FeaturesService } from './features.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

describe('FeaturesService', () => {
  let service: FeaturesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeaturesService, PrismaService],
    }).compile();

    service = module.get<FeaturesService>(FeaturesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a feature', async () => {
    const dto: CreateFeatureDto = {
      name: 'Test',
      icon: 'icon',
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.features, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.features.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should find all features', async () => {
    const expectedResult = [{ id: 1, name: 'test', icon: 'icon', active: true, createdAt: new Date(), updatedAt: new Date() }];

    jest.spyOn(prisma.features, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one feature', async () => {
    const expectedResult = { id: 1, name: 'test', icon: 'icon', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.features, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.features.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a feature', async () => {
    const dto: UpdateFeatureDto = {
      name: 'Updated',
      icon: 'new-icon',
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.features, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.features.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a feature', async () => {
    const expectedResult = { id: 1, name: 'test', icon: 'icon', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.features, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.features.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

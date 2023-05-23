import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsService } from './keywords.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

describe('KeywordsService', () => {
  let service: KeywordsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordsService, PrismaService],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a keyword', async () => {
    const dto: CreateKeywordDto = {
      name: 'Test',
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.keywords, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.keywords.create).toHaveBeenCalledWith({
      data: { ...dto, name: dto.name.toLowerCase() },
    });
  });

  it('should find all keywords', async () => {
    const expectedResult = [{ id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() }];

    jest.spyOn(prisma.keywords, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one keyword', async () => {
    const expectedResult = { id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.keywords, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.keywords.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a keyword', async () => {
    const dto: UpdateKeywordDto = {
      name: 'Updated',
    };

    const expectedResult = { id: 1, ...dto, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.keywords, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.keywords.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { ...dto, name: dto.name.toLowerCase() },
    });
  });

  it('should remove a keyword', async () => {
    const expectedResult = { id: 1, name: 'test', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.keywords, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.keywords.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

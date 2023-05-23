import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersCategoryService } from './suppliers-category.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateSuppliersCategoryDto } from './dto/create-suppliers-category.dto';
import { UpdateSuppliersCategoryDto } from './dto/update-suppliers-category.dto';

describe('SuppliersCategoryService', () => {
  let service: SuppliersCategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersCategoryService, PrismaService],
    }).compile();

    service = module.get<SuppliersCategoryService>(SuppliersCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should find all suppliers categories', async () => {
    const expectedResult = [{ id: 1, name: 'test', parentId: 1, active: true, createdAt: new Date(), updatedAt: new Date() }];

    jest.spyOn(prisma.suppliersCategory, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one suppliers category', async () => {
    const expectedResult = { id: 1, name: 'test', parentId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.suppliersCategory, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.suppliersCategory.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should create a suppliers category', async () => {
    const dto: CreateSuppliersCategoryDto = { name: 'test' };
    const expectedResult = { id: 1, name: 'test', parentId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.suppliersCategory, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(prisma.suppliersCategory.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should update a suppliers category', async () => {
    const dto: UpdateSuppliersCategoryDto = { name: 'updated' };
    const expectedResult = { id: 1, name: 'update', parentId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.suppliersCategory, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.suppliersCategory.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a suppliers category', async () => {
    const expectedResult = { id: 1, name: 'test', parentId: 1, active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.suppliersCategory, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.suppliersCategory.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoryRepository } from './products-category.repository';
import { FindRelevantsByTermParams, FindRelevantsParams } from './interfaces/products-category.interface';
import { sortLevensthein } from '../../utils/sort.util';

describe('ProductsCategoryService', () => {
  let service: ProductsCategoryService;
  const repository = {
    findRelevants: jest.fn().mockResolvedValue([]),
    findRelevantsByTerm: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCategoryService,
        {
          provide: ProductsCategoryRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProductsCategoryService>(ProductsCategoryService);
  });

  it('should find relevants', async () => {
    const params: FindRelevantsParams = { quantity: '10' };
    expect(await service.findRelevants(params)).toEqual([]);
    expect(repository.findRelevants).toHaveBeenCalledWith(params);
  });

  it('should find relevants by term', async () => {
    const params: FindRelevantsByTermParams = { quantity: '10', term: 'test' };
    expect(await service.findRelevantsByTerm(params)).toEqual([]);
    expect(repository.findRelevantsByTerm).toHaveBeenCalledWith(params);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { SearchByTermDto, SearchByTermPaginatedDto } from './dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  const productRepository = {
    findProductByTerm: jest.fn().mockResolvedValue({}),
    findHighlightProductByTerm: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: productRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a product by term', async () => {
    const dto: SearchByTermPaginatedDto = { term: 'test', page: 1, pageSize: 10 };
    const result = await service.findProductByTerm(dto);
    expect(result).toEqual({});
    expect(productRepository.findProductByTerm).toHaveBeenCalledWith(dto);
  });

  it('should find a highlight product by term', async () => {
    const dto: SearchByTermDto = { term: 'test' };
    const result = await service.findHighlightProductByTerm(dto);
    expect(result).toEqual({});
    expect(productRepository.findHighlightProductByTerm).toHaveBeenCalledWith(dto);
  });

  it('should find one product', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({});
    expect(productRepository.findOne).toHaveBeenCalledWith(1);
  });
});

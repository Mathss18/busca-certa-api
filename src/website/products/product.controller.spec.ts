import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SearchByTermDto, SearchByTermPaginatedDto } from './dto/product.dto';

describe('ProductController', () => {
  let app: INestApplication;
  const productService = {
    // Mocking the ProductService
    findOne: jest.fn().mockResolvedValue({}),
    findProductByTerm: jest.fn().mockResolvedValue([]),
    findHighlightProductByTerm: jest.fn().mockResolvedValue([]),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: productService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET one`, () => {
    return request(app.getHttpServer())
      .get('/website/products/1')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual({});
        expect(productService.findOne).toHaveBeenCalledWith(1);
      });
  });

  it(`/POST search-by-term`, () => {
    const dto: SearchByTermPaginatedDto = { term: 'test', page: 1, pageSize: 10 };
    return request(app.getHttpServer())
      .post('/website/products/search-by-term')
      .send(dto)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual([]);
        expect(productService.findProductByTerm).toHaveBeenCalledWith(dto);
      });
  });

  it(`/POST highlight-by-term`, () => {
    const dto: SearchByTermDto = { term: 'test' };
    return request(app.getHttpServer())
      .post('/website/products/highlight-by-term')
      .send(dto)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual([]);
        expect(productService.findHighlightProductByTerm).toHaveBeenCalledWith(dto);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

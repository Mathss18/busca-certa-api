import { Test, TestingModule } from '@nestjs/testing';
import { ProductsCategoryController } from './products-category.controller';
import { ProductsCategoryService } from './products-category.service';
import { FindRelevantsParams, FindRelevantsByTermParams } from './dto/products-category.dto';
import { HttpReturn } from '../../shared/http-response';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('ProductsCategoryController', () => {
  let app: INestApplication;
  const productsCategoryService = {
    findRelevants: jest.fn().mockResolvedValue({}),
    findRelevantsByTerm: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsCategoryController],
      providers: [
        {
          provide: ProductsCategoryService,
          useValue: productsCategoryService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('GET /website/products-category/find-relevants - should return relevants', () => {
    const params: FindRelevantsParams = { quantity: '10' };
    return request(app.getHttpServer())
      .get('/website/products-category/find-relevants')
      .query(params)
      .expect(200)
      .expect(HttpReturn.build({ data: {} }));
  });

  it('GET /website/products-category/find-relevants-by-term - should return relevants by term', () => {
    const params: FindRelevantsByTermParams = { quantity: '10', term: 'test' };
    return request(app.getHttpServer())
      .get('/website/products-category/find-relevants-by-term')
      .query(params)
      .expect(200)
      .expect(HttpReturn.build({ data: {} }));
  });

  afterAll(async () => {
    await app.close();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { ProductVariationsController } from './product-variations.controller';
import { ProductVariationsService } from './product-variations.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';
import { APP_GUARD } from '@nestjs/core';

jest.mock('../auth/jwt-auth/jwt-auth.guard', () => {
  return {
    JwtAuthGuard: jest.fn().mockImplementation(() => {
      return {
        canActivate: (context) => {
          return true;
        },
      };
    }),
  };
});

describe('ProductVariationsController', () => {
  let app: INestApplication;
  let productVariationsService: ProductVariationsService;

  const mockProductVariationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationsController],
      providers: [
        ProductVariationsService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(ProductVariationsService)
      .useValue(mockProductVariationsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    productVariationsService = module.get<ProductVariationsService>(ProductVariationsService);
  });

  it('should create a product variation', async () => {
    const createProductVariationDto = new CreateProductVariationDto();
    mockProductVariationsService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/product-variations')
      .send(createProductVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all product variations', async () => {
    mockProductVariationsService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer())
      .get('/manager/product-variations')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All', message: '' });
  });

  it('should find one product variation', async () => {
    const id = '1';
    mockProductVariationsService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/product-variations/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a product variation', async () => {
    const id = '1';
    const updateProductVariationDto = new UpdateProductVariationDto();
    mockProductVariationsService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/product-variations/${id}`)
      .send(updateProductVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a product variation', async () => {
    const id = '1';
    mockProductVariationsService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/product-variations/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  afterEach(async () => {
    await app.close();
    jest.resetAllMocks();
  });
});

describe('CreateProductVariationDto', () => {
  it('should validate if productId and variationId are not empty', async () => {
    const dto = new CreateProductVariationDto();
    dto.productId = 1;
    dto.variationId = 1;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if productId or variationId are empty', async () => {
    const dto = new CreateProductVariationDto();
    dto.productId = null;
    dto.variationId = null;
    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    expect(errors[0].property).toEqual('productId');
    expect(errors[1].property).toEqual('variationId');
  });
});

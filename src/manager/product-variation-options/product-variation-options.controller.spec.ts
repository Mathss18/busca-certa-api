import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { ProductVariationOptionsController } from './product-variation-options.controller';
import { ProductVariationOptionsService } from './product-variation-options.service';
import { CreateProductVariationOptionDto } from './dto/create-product-variation-option.dto';
import { UpdateProductVariationOptionDto } from './dto/update-product-variation-option.dto';
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

describe('ProductVariationOptionsController', () => {
  let app: INestApplication;
  let productVariationOptionsService: ProductVariationOptionsService;

  const mockProductVariationOptionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationOptionsController],
      providers: [
        ProductVariationOptionsService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(ProductVariationOptionsService)
      .useValue(mockProductVariationOptionsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    productVariationOptionsService = module.get<ProductVariationOptionsService>(ProductVariationOptionsService);
  });

  it('should create a product variation option', async () => {
    const createProductVariationOptionDto = new CreateProductVariationOptionDto();
    mockProductVariationOptionsService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/product-variation-options')
      .send(createProductVariationOptionDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all product variation options', async () => {
    mockProductVariationOptionsService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer())
      .get('/manager/product-variation-options')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All', message: '' });
  });

  it('should find one product variation option', async () => {
    const id = '1';
    mockProductVariationOptionsService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/product-variation-options/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a product variation option', async () => {
    const id = '1';
    const updateProductVariationOptionDto = new UpdateProductVariationOptionDto();
    mockProductVariationOptionsService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/product-variation-options/${id}`)
      .send(updateProductVariationOptionDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a product variation option', async () => {
    const id = '1';
    mockProductVariationOptionsService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/product-variation-options/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  afterEach(async () => {
    await app.close();
    jest.resetAllMocks();
  });
});

describe('CreateProductVariationOptionDto', () => {
  it('should validate if productVariationId and variationOptionId are not empty', async () => {
    const dto = new CreateProductVariationOptionDto();
    dto.productVariationId = 1;
    dto.variationOptionId = 1;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if productVariationId or variationOptionId are empty', async () => {
    const dto = new CreateProductVariationOptionDto();
    dto.productVariationId = null;
    dto.variationOptionId = null;
    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    expect(errors[0].property).toEqual('productVariationId');
    expect(errors[1].property).toEqual('variationOptionId');
  });
});

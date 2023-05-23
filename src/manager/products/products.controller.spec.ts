import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { S3Service } from '../../aws/s3/s3.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

describe('ProductsController', () => {
  let app: INestApplication;
  let productsService: ProductsService;
  let s3Service: S3Service;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findOneWithVariationsAndVariationOptions: jest.fn(),
  };

  const mockS3Service = {
    upload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        S3Service,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .compile();

    app = module.createNestApplication();
    await app.init();
    productsService = module.get<ProductsService>(ProductsService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should create a product', async () => {
    const createProductDto = new CreateProductDto();
    mockProductsService.create.mockResolvedValue('Created');

    const image = Buffer.from('TestLogo', 'utf8');

    return request(app.getHttpServer())
      .post('/manager/products')
      .attach('image', image, { filename: 'image.png' })
      .field('product', JSON.stringify(createProductDto))
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all products', async () => {
    mockProductsService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer()).get('/manager/products').expect(HttpStatus.OK).expect({ success: true, data: 'All', message: '' });
  });

  it('should find one product', async () => {
    const id = '1';
    mockProductsService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/products/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a product', async () => {
    const id = '1';
    const updateProductDto = new UpdateProductDto();
    mockProductsService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/products/${id}`)
      .send(updateProductDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a product', async () => {
    const id = '1';
    mockProductsService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/products/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  it('should find one product with variations and options', async () => {
    const id = '1';
    mockProductsService.findOneWithVariationsAndVariationOptions.mockResolvedValue(`Found ${id} with variations and options`);

    return request(app.getHttpServer())
      .get(`/manager/products/${id}/variations`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Found ${id} with variations and options`, message: '' });
  });

  describe('CreateProductDto', () => {
    it('should not create a product', async () => {
      const dto = new CreateProductDto();
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
    await app.close();
    jest.resetAllMocks();
  });
});

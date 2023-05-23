import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../../aws/s3/s3.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { ProductsCategoryService } from './products-category.service';
import { ProductsCategoryController } from './products-category.controller';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';

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
jest.mock('../../aws/s3/s3.service');

describe('ProductCategoryController', () => {
  let app: INestApplication;
  let productCategoryService: ProductsCategoryService;
  let s3Service: S3Service;

  const mockProductCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockS3Service = {
    upload: jest.fn().mockImplementation((name, file) => Promise.resolve(`https://mocks3service.com/${name}`)),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsCategoryController],
      providers: [
        ProductsCategoryService,
        S3Service,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(ProductsCategoryService)
      .useValue(mockProductCategoryService)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .compile();

    app = module.createNestApplication();
    await app.init();
    productCategoryService = module.get<ProductsCategoryService>(ProductsCategoryService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should create a product-category', async () => {
    const dto = new CreateProductsCategoryDto();
    mockProductCategoryService.create.mockResolvedValue('Created');

    const image = Buffer.from('TestLogo', 'utf8');

    return request(app.getHttpServer())
      .post('/manager/products-category')
      .attach('image', image, { filename: 'image.png' })
      .field('product-category', JSON.stringify(dto))
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all product categories', async () => {
    mockProductCategoryService.findAll.mockResolvedValue('All product categories');

    return request(app.getHttpServer())
      .get('/manager/products-category')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All product categories', message: '' });
  });

  it('should find one product-category', async () => {
    const id = '1';
    mockProductCategoryService.findOne.mockResolvedValue(`Found product-category ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/products-category/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Found product-category ${id}`, message: '' });
  });

  it('should update a product-category', async () => {
    const id = '1';
    const dto = new UpdateProductsCategoryDto();
    dto.name = 'Updated';
    mockProductCategoryService.update.mockResolvedValue(`Updated ${id}`);

    const image = Buffer.from('UpdatedImage', 'utf8');

    return request(app.getHttpServer())
      .put(`/manager/products-category/${id}`)
      .attach('image', image, { filename: 'updated-image.png' })
      .field('product-category', JSON.stringify(dto))
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a product-category', async () => {
    const id = '1';
    mockProductCategoryService.remove.mockResolvedValue(`Removed product-category ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/products-category/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed product-category ${id}`, message: '' });
  });

  describe('CreateProductsCategoryDto', () => {
    it('should be valid with all fields', async () => {
      const dto = new CreateProductsCategoryDto();
      dto.name = 'Test Category';
      dto.image = 'http://example.com/image.png';
      dto.parentId = 1;
      dto.active = true;

      const validationErrors = await validate(dto);
      expect(validationErrors).toHaveLength(0);
    });

    it('should fail validation due to missing required field', async () => {
      const dto = new CreateProductsCategoryDto();
      dto.image = 'http://example.com/image.png';
      dto.parentId = 1;
      dto.active = true;

      const validationErrors = await validate(dto);
      expect(validationErrors).not.toHaveLength(0);
    });

    it('should fail validation due to invalid URL', async () => {
      const dto = new CreateProductsCategoryDto();
      dto.name = 'Test Category';
      dto.image = 'invalid-url';
      dto.parentId = 1;
      dto.active = true;

      const validationErrors = await validate(dto);
      const urlError = validationErrors.find((error) => error.property === 'image');
      expect(urlError).toBeDefined();
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

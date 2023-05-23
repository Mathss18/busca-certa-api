import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersCategoryController } from './suppliers-category.controller';
import { SuppliersCategoryService } from './suppliers-category.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateSuppliersCategoryDto } from './dto/create-suppliers-category.dto';
import { UpdateSuppliersCategoryDto } from './dto/update-suppliers-category.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';

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

describe('SuppliersCategoryController', () => {
  let app: INestApplication;
  let suppliersCategoryService: SuppliersCategoryService;

  const mockSuppliersCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersCategoryController],
      providers: [
        SuppliersCategoryService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(SuppliersCategoryService)
      .useValue(mockSuppliersCategoryService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    suppliersCategoryService = module.get<SuppliersCategoryService>(SuppliersCategoryService);
  });

  it('should create a suppliers category', async () => {
    const createSuppliersCategoryDto = new CreateSuppliersCategoryDto();
    createSuppliersCategoryDto.name = 'Test Category';
    mockSuppliersCategoryService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/suppliers-category')
      .send(createSuppliersCategoryDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all suppliers categories', async () => {
    mockSuppliersCategoryService.findAll.mockResolvedValue('All suppliers categories');

    return request(app.getHttpServer())
      .get('/manager/suppliers-category')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All suppliers categories', message: '' });
  });

  it('should find one suppliers category', async () => {
    const id = '1';
    mockSuppliersCategoryService.findOne.mockResolvedValue(`Suppliers Category ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/suppliers-category/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Suppliers Category ${id}`, message: '' });
  });

  it('should update a suppliers category', async () => {
    const id = '1';
    const updateSuppliersCategoryDto = new UpdateSuppliersCategoryDto();
    mockSuppliersCategoryService.update.mockResolvedValue(`Updated suppliers category ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/suppliers-category/${id}`)
      .send(updateSuppliersCategoryDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated suppliers category ${id}`, message: '' });
  });

  it('should remove a suppliers category', async () => {
    const id = '1';
    mockSuppliersCategoryService.remove.mockResolvedValue(`Removed suppliers category ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/suppliers-category/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed suppliers category ${id}`, message: '' });
  });

  describe('CreateSuppliersCategoryDto', () => {
    it('should be valid with a name and optional parentId and active status', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = 'Suppliers Category Name';
      dto.parentId = 1;
      dto.active = true;

      const errors = await validate(dto);
      expect(errors.length).toEqual(0);
    });

    it('should be invalid with an empty name', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a name longer than 191 characters', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = 'a'.repeat(192);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a non-string name', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = 123 as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a non-number parentId', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = 'Valid Name';
      dto.parentId = 'invalid' as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a non-boolean active status', async () => {
      const dto = new CreateSuppliersCategoryDto();
      dto.name = 'Valid Name';
      dto.active = 'invalid' as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

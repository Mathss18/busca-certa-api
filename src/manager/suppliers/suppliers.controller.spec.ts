import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { S3Service } from '../../aws/s3/s3.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
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
jest.mock('../../aws/s3/s3.service');

describe('SuppliersController', () => {
  let app: INestApplication;
  let suppliersService: SuppliersService;
  let s3Service: S3Service;

  const mockSuppliersService = {
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
      controllers: [SuppliersController],
      providers: [
        SuppliersService,
        S3Service,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(SuppliersService)
      .useValue(mockSuppliersService)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .compile();

    app = module.createNestApplication();
    await app.init();
    suppliersService = module.get<SuppliersService>(SuppliersService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should create a supplier', async () => {
    const createSupplierDto = new CreateSupplierDto();
    mockSuppliersService.create.mockResolvedValue('Created');

    const logo = Buffer.from('TestLogo', 'utf8');

    return request(app.getHttpServer())
      .post('/manager/suppliers')
      .attach('logo', logo, { filename: 'logo.png' })
      .field('supplier', JSON.stringify(createSupplierDto))
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all suppliers', async () => {
    mockSuppliersService.findAll.mockResolvedValue('All suppliers');

    return request(app.getHttpServer())
      .get('/manager/suppliers')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All suppliers', message: '' });
  });

  it('should find one supplier', async () => {
    const id = '1';
    mockSuppliersService.findOne.mockResolvedValue(`Found supplier ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/suppliers/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Found supplier ${id}`, message: '' });
  });

  it('should update a supplier', async () => {
    const id = '1';
    const updateSupplierDto = new UpdateSupplierDto();
    updateSupplierDto.companyName = 'Updated Supplier';
    mockSuppliersService.update.mockResolvedValue(`Updated supplier ${id}`);

    const logo = Buffer.from('UpdatedLogo', 'utf8');

    return request(app.getHttpServer())
      .put(`/manager/suppliers/${id}`)
      .attach('logo', logo, { filename: 'updated-logo.png' })
      .field('supplier', JSON.stringify(updateSupplierDto))
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated supplier ${id}`, message: '' });
  });

  it('should remove a supplier', async () => {
    const id = '1';
    mockSuppliersService.remove.mockResolvedValue(`Removed supplier ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/suppliers/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed supplier ${id}`, message: '' });
  });

  it('should not update set supplier action areas to empty string when update', async () => {
    const id = '1';
    const updateSupplierDto = new UpdateSupplierDto();
    updateSupplierDto.companyName = 'Updated Supplier';
    updateSupplierDto.actionAreas = ''; // sending incorrect action areas
    mockSuppliersService.update.mockResolvedValue(`Updated supplier ${id}`);

    const dtoWithoutActionAreas = { ...updateSupplierDto };
    delete dtoWithoutActionAreas.actionAreas;

    await request(app.getHttpServer()).put(`/manager/suppliers/${id}`).send(updateSupplierDto).expect(HttpStatus.OK);

    expect(mockSuppliersService.update).toHaveBeenCalledWith(1, dtoWithoutActionAreas);
  });

  describe('CreateSupplierDto', () => {
    it('should be valid with all fields', async () => {
      const dto = new CreateSupplierDto();
      dto.companyName = 'Test Supplier';
      dto.tradingName = 'Test Supplier Trading Name';
      dto.cnpj = '11222333000100';
      dto.email = 'test@example.com';
      dto.phoneNumber = '1234567890';
      dto.mobileNumber = '0987654321';
      dto.segment = 'Test Segment';
      dto.description = 'Test Description';
      dto.logo = 'http://example.com/logo.png';
      dto.street = 'Test Street';
      dto.number = '123';
      dto.neighborhood = 'Test Neighborhood';
      dto.city = 'Test City';
      dto.state = 'TS';
      dto.zipCode = '12345-678';
      dto.active = true;

      const validationErrors = await validate(dto);
      expect(validationErrors).toHaveLength(0);
    });

    it('should fail validation due to missing required fields', async () => {
      const dto = new CreateSupplierDto();
      const validationErrors = await validate(dto);

      expect(validationErrors).not.toHaveLength(0);
    });

    it('should fail validation due to invalid email', async () => {
      const dto = new CreateSupplierDto();
      dto.email = 'invalid-email';
      const validationErrors = await validate(dto);

      const emailError = validationErrors.find((error) => error.property === 'email');
      expect(emailError).toBeDefined();
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

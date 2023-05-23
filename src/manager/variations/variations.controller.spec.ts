import { Test, TestingModule } from '@nestjs/testing';
import { VariationsController } from './variations.controller';
import { VariationsService } from './variations.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';

jest.mock('../auth/jwt-auth/jwt-auth.guard', () => {
  return {
    // Mock the entire guard
    JwtAuthGuard: jest.fn().mockImplementation(() => {
      return {
        canActivate: (context) => {
          return true; // Allow all requests to bypass the guard
        },
      };
    }),
  };
});

describe('VariationsController', () => {
  let app: INestApplication;
  let variationsService: VariationsService;

  const mockVariationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsController],
      providers: [
        VariationsService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(VariationsService)
      .useValue(mockVariationsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    variationsService = module.get<VariationsService>(VariationsService);
  });

  it('should create a variation', async () => {
    const createVariationDto = new CreateVariationDto();
    mockVariationsService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/variations')
      .send(createVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all variations', async () => {
    mockVariationsService.findAll.mockResolvedValue('All variations');

    return request(app.getHttpServer())
      .get('/manager/variations')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All variations', message: '' });
  });

  it('should find one variation', async () => {
    const id = '1';
    mockVariationsService.findOne.mockResolvedValue(`Variation ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/variations/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Variation ${id}`, message: '' });
  });

  it('should update a variation', async () => {
    const id = '1';
    const updateVariationDto = new UpdateVariationDto();
    mockVariationsService.update.mockResolvedValue(`Updated variation ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/variations/${id}`)
      .send(updateVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated variation ${id}`, message: '' });
  });

  it('should remove a variation', async () => {
    const id = '1';
    mockVariationsService.remove.mockResolvedValue(`Removed variation ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/variations/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed variation ${id}`, message: '' });
  });

  describe('CreateVariationDto', () => {
    it('should be valid with a name and an optional active status', async () => {
      const dto = new CreateVariationDto();
      dto.name = 'Variation Name';
      dto.active = true;

      const errors = await validate(dto);
      expect(errors.length).toEqual(0);
    });

    it('should be invalid with an empty name', async () => {
      const dto = new CreateVariationDto();
      dto.name = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a name longer than 191 characters', async () => {
      const dto = new CreateVariationDto();
      dto.name = 'a'.repeat(192);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a non-string name', async () => {
      const dto = new CreateVariationDto();
      dto.name = 123 as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

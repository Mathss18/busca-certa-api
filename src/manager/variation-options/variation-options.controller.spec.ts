import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { VariationOptionsController } from './variation-options.controller';
import { VariationOptionsService } from './variation-options.service';
import { CreateVariationOptionDto } from './dto/create-variation-option.dto';
import { UpdateVariationOptionDto } from './dto/update-variation-option.dto';

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

describe('VariationOptionsController', () => {
  let app: INestApplication;
  let variationOptionsService: VariationOptionsService;

  const mockVariationOptionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationOptionsController],
      providers: [
        VariationOptionsService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(VariationOptionsService)
      .useValue(mockVariationOptionsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    variationOptionsService = module.get<VariationOptionsService>(VariationOptionsService);
  });

  it('should create a variation option', async () => {
    const createVariationDto = new CreateVariationOptionDto();
    mockVariationOptionsService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/variation-options')
      .send(createVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all variations options', async () => {
    mockVariationOptionsService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer())
      .get('/manager/variation-options')
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'All', message: '' });
  });

  it('should find one variation option', async () => {
    const id = '1';
    mockVariationOptionsService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/variation-options/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a variation option', async () => {
    const id = '1';
    const updateVariationDto = new UpdateVariationOptionDto();
    mockVariationOptionsService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/variation-options/${id}`)
      .send(updateVariationDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a variation options', async () => {
    const id = '1';
    mockVariationOptionsService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/variation-options/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  describe('CreateVariationOptionDto', () => {
    it('should be valid with a name and an optional active status', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = 'Variation option Name';
      dto.variationId = 1;
      dto.active = true;

      const errors = await validate(dto);
      expect(errors.length).toEqual(0);
    });

    it('should be invalid with an empty name', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = '';
      dto.variationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a name longer than 191 characters', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = 'a'.repeat(192);
      dto.variationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a non-string name', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = 123 as any;
      dto.variationId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid with a null variationId', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = 'Variation option';
      dto.variationId = null;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should be invalid when variationId is not present', async () => {
      const dto = new CreateVariationOptionDto();
      dto.name = 'Variation option with just name';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

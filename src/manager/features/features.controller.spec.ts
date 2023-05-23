import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { validate } from 'class-validator';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

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

describe('FeaturesController', () => {
  let app: INestApplication;
  let featuresService: FeaturesService;

  const mockFeaturesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturesController],
      providers: [
        FeaturesService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(FeaturesService)
      .useValue(mockFeaturesService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    featuresService = module.get<FeaturesService>(FeaturesService);
  });

  it('should create a feature', async () => {
    const createFeatureDto = new CreateFeatureDto();
    mockFeaturesService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/features')
      .send(createFeatureDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all features', async () => {
    mockFeaturesService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer()).get('/manager/features').expect(HttpStatus.OK).expect({ success: true, data: 'All', message: '' });
  });

  it('should find one feature', async () => {
    const id = '1';
    mockFeaturesService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/features/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a feature', async () => {
    const id = '1';
    const updateFeatureDto = new UpdateFeatureDto();
    mockFeaturesService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/features/${id}`)
      .send(updateFeatureDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a feature', async () => {
    const id = '1';
    mockFeaturesService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/features/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  afterEach(async () => {
    await app.close();
    jest.resetAllMocks();
  });
});

describe('CreateFeatureDto', () => {
  it('should validate if name and icon are not empty and name is not longer than 191 characters', async () => {
    const dto = new CreateFeatureDto();
    dto.name = 'Test Feature';
    dto.icon = 'icon-name';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if name or icon are empty or name is too long', async () => {
    const dto = new CreateFeatureDto();
    dto.name = '';
    dto.icon = '';
    let errors = await validate(dto);
    expect(errors).toHaveLength(2);

    dto.name = 'a'.repeat(192);
    dto.icon = 'icon-name';
    errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('name');
  });
});

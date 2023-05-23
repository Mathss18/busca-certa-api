import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { validate } from 'class-validator';
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

describe('KeywordsController', () => {
  let app: INestApplication;
  let keywordService: KeywordsService;

  const mockKeywordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeywordsController],
      providers: [
        KeywordsService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(KeywordsService)
      .useValue(mockKeywordsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
    keywordService = module.get<KeywordsService>(KeywordsService);
  });

  it('should create a keyword', async () => {
    const createKeywordDto = new CreateKeywordDto();
    mockKeywordsService.create.mockResolvedValue('Created');

    return request(app.getHttpServer())
      .post('/manager/keywords')
      .send(createKeywordDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: 'Created', message: '' });
  });

  it('should find all keywords', async () => {
    mockKeywordsService.findAll.mockResolvedValue('All');

    return request(app.getHttpServer()).get('/manager/keywords').expect(HttpStatus.OK).expect({ success: true, data: 'All', message: '' });
  });

  it('should find one keyword', async () => {
    const id = '1';
    mockKeywordsService.findOne.mockResolvedValue(`find ${id}`);

    return request(app.getHttpServer())
      .get(`/manager/keywords/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `find ${id}`, message: '' });
  });

  it('should update a keyword', async () => {
    const id = '1';
    const updateKeywordDto = new UpdateKeywordDto();
    mockKeywordsService.update.mockResolvedValue(`Updated ${id}`);

    return request(app.getHttpServer())
      .put(`/manager/keywords/${id}`)
      .send(updateKeywordDto)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Updated ${id}`, message: '' });
  });

  it('should remove a keyword', async () => {
    const id = '1';
    mockKeywordsService.remove.mockResolvedValue(`Removed ${id}`);

    return request(app.getHttpServer())
      .delete(`/manager/keywords/${id}`)
      .expect(HttpStatus.OK)
      .expect({ success: true, data: `Removed ${id}`, message: '' });
  });

  afterEach(async () => {
    await app.close();
    jest.resetAllMocks();
  });
});

describe('CreateKeywordDto', () => {
  it('should validate if name is not empty and not longer than 191 characters', async () => {
    const dto = new CreateKeywordDto();
    dto.name = 'Test Keyword';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should not validate if name is empty or too long', async () => {
    const dto = new CreateKeywordDto();
    dto.name = '';
    let errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('name');

    dto.name = 'a'.repeat(192);
    errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('name');
  });
});

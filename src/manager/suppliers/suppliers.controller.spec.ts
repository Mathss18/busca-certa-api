import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Response } from 'express';

describe('SuppliersController', () => {
  let controller: SuppliersController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const supplierMock = {
    id: 1,
    companyName: 'Empresa Teste',
    tradingName: 'Empresinha',
    cnpj: '1234567892',
    email: 'a2@a.com',
    phoneNumber: '1934353705',
    mobileNumber: '19983136930',
    segment: 'Metalorgico',
    website: 'https://google.com',
    description: 'descricao',
    logo: 'logo',
    street: 'Rua dos amores',
    number: '127',
    neighborhood: 'São Jorge',
    city: 'Piracicaba',
    state: 'São Paulo',
    zipCode: '13402803',
    supplierCategoryId: null,
    active: true,
    createdAt: '2023-03-01T00:48:09.470Z',
    updatedAt: '2023-03-01T00:48:09.470Z',
  };

  const modifiedSupplier = {
    ...supplierMock,
    companyName: 'Empresa Teste2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        SuppliersService,
        {
          provide: SuppliersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([supplierMock]),
            findOne: jest.fn().mockResolvedValue(supplierMock),
            create: jest.fn().mockResolvedValue(supplierMock),
            update: jest.fn().mockResolvedValue(modifiedSupplier),
            remove: jest.fn().mockResolvedValue(supplierMock),
          },
        },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all suppliers', () => {
    it('should return an array of suppliers', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [supplierMock],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a supplier', () => {
    it('should return a supplier', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: supplierMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a supplier', () => {
    it('should create a supplier', async () => {
      const result: any = await controller.create(supplierMock, res);
      expect(result).toStrictEqual({
        data: supplierMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a supplier', () => {
    it('should update a supplier', async () => {
      const result: any = await controller.update('1', modifiedSupplier, res);
      expect(result).toStrictEqual({
        data: modifiedSupplier,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a supplier', () => {
    it('should remove a supplier', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: supplierMock,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

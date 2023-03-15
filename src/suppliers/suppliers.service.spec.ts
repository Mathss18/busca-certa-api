import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { SuppliersService } from './suppliers.service';

const suppliersArray = [
  {
    id: 1,
    companyName: 'Empresa Teste',
    tradingName: 'Empresinha',
    cnpj: '1234567891',
    email: 'a1@a.com',
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
  },
  {
    id: 2,
    companyName: 'Empresa Teste2',
    tradingName: 'Empresinha2',
    cnpj: '1234567893',
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
  },
];

const oneSupplier = suppliersArray[0];
const oneSupplierModified = {
  ...oneSupplier,
  companyName: 'Empresa Teste 2',
};

describe('SuppliersService', () => {
  let service: SuppliersService;
  let prisma: PrismaService;

  const db = {
    supplier: {
      findMany: jest.fn().mockResolvedValue(suppliersArray),
      findFirst: jest.fn().mockResolvedValue(oneSupplier),
      create: jest.fn().mockResolvedValue(oneSupplier),
      update: jest.fn().mockResolvedValue(oneSupplierModified),
      delete: jest.fn().mockResolvedValue(oneSupplier),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of suppliers', async () => {
      const suppliers = await service.findAll();
      expect(suppliers).toEqual(suppliersArray);
    });
  });

  describe('getOne', () => {
    it('should get a single supplier', () => {
      expect(service.findOne(1)).resolves.toEqual(oneSupplier);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a supplier', () => {
      expect(service.create(oneSupplier)).resolves.toEqual(oneSupplier);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const supplier = await service.update(1, oneSupplierModified);
      expect(supplier).toEqual(oneSupplierModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a supplier', () => {
      expect(service.remove(1)).resolves.toEqual(oneSupplier);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from './users.service';

const usersArray = [
  {
    id: 1,
    name: 'João',
    email: 'joão@joão.com',
    password: 'senha-forte',
    type: 'admin',
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  },
  {
    id: 2,
    name: 'Maria',
    email: 'maria@maria.com',
    password: 'senha-forte',
    type: 'admin',
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  },
];

const oneProduct = usersArray[0];
const oneProductModified = {
  ...oneProduct,
  name: 'Pedro',
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const db = {
    users: {
      findMany: jest.fn().mockResolvedValue(usersArray),
      findFirst: jest.fn().mockResolvedValue(oneProduct),
      create: jest.fn().mockResolvedValue(oneProduct),
      update: jest.fn().mockResolvedValue(oneProductModified),
      delete: jest.fn().mockResolvedValue(oneProduct),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll()).toEqual(usersArray);
    });
  });

  describe('getOne', () => {
    it('should get a single users', () => {
      expect(service.findOne(1)).resolves.toEqual(oneProduct);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a users', () => {
      expect(service.create(oneProduct)).resolves.toEqual(oneProduct);
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const users = await service.update(1, oneProductModified);
      expect(users).toEqual(oneProductModified);
    });
  });

  describe('deleteOne', () => {
    it('should dlete a users', () => {
      expect(service.remove(1)).resolves.toEqual(oneProduct);
    });
  });
});

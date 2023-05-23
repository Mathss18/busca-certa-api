import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'Test',
      email: 'test@test.com',
      password: 'hashedPassword',
      type: 'admin',
    };

    const hashedPassword = 'hashedPassword';
    const expectedResult = { id: 1, ...dto, password: hashedPassword, active: true, createdAt: new Date(), updatedAt: new Date() };

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    jest.spyOn(prisma.users, 'create').mockResolvedValue(expectedResult);

    expect(await service.create(dto)).toEqual(expectedResult);
    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: { ...dto, password: hashedPassword },
    });
  });

  it('should find all users', async () => {
    const expectedResult = [
      {
        id: 1,
        name: 'test',
        email: 'test@test.com',
        password: 'hashedPassword',
        type: 'admin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(prisma.users, 'findMany').mockResolvedValue(expectedResult);

    expect(await service.findAll()).toEqual(expectedResult);
  });

  it('should find one user', async () => {
    const expectedResult = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: 'hashedPassword',
      type: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findOne(1)).toEqual(expectedResult);
    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = {
      name: 'Updated',
      password: 'hashedPassword!',
      email: 'updated@test.com',
      type: 'user',
    };

    const expectedResult = { id: 1, ...dto, password: 'hashedPassword', active: true, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(prisma.users, 'update').mockResolvedValue(expectedResult);

    expect(await service.update(1, dto)).toEqual(expectedResult);
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should remove a user', async () => {
    const expectedResult = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: 'hashedPassword',
      type: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.users, 'delete').mockResolvedValue(expectedResult);

    expect(await service.remove(1)).toEqual(expectedResult);
    expect(prisma.users.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should find a user by email', async () => {
    const expectedResult = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: 'hashedPassword',
      type: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(expectedResult);

    expect(await service.findByEmail('test@test.com')).toEqual(expectedResult);
    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
  });
});

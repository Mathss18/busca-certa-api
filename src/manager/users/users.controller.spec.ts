import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const res = {
    status: jest.fn(() => ({
      json: jest.fn((y) => y),
    })),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const user = {
    id: 2,
    name: 'Mario',
    email: 'mario@email.com',
    password: 'senha-forte',
    type: 'admin',
    active: true,
    createdAt: '2023-03-09T19:56:30.316Z',
    updatedAt: '2023-03-09T19:56:30.316Z',
  };

  const modifiedUsers = {
    ...user,
    name: 'João',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([user]),
            findOne: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(modifiedUsers),
            remove: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all user', () => {
    it('should return an array of user', async () => {
      const result: any = await controller.findAll(res);
      expect(result).toStrictEqual({
        data: [user],
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get a user', () => {
    it('should return a user', async () => {
      const result: any = await controller.findOne('1', res);
      expect(result).toStrictEqual({
        data: user,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create a user', () => {
    it('should create a user', async () => {
      const result: any = await controller.create(user, res);
      expect(result).toStrictEqual({
        data: user,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update a user', () => {
    it('should update a user', async () => {
      const result: any = await controller.update('1', modifiedUsers, res);
      expect(result).toStrictEqual({
        data: modifiedUsers,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('remove a user', () => {
    it('should remove a user', async () => {
      const result: any = await controller.remove('1', res);
      expect(result).toStrictEqual({
        data: user,
        message: '',
        success: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

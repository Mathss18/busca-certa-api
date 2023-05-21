import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    createUserDto.password = hashedPassword;

    return this.prismaService.users.create({
      data: createUserDto,
    });
  }

  findAll(): Promise<Users[]> {
    return this.prismaService.users.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  findOne(id: number): Promise<Users> {
    return this.prismaService.users.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.prismaService.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number): Promise<Users> {
    return this.prismaService.users.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<Users> {
    return this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
  }
}

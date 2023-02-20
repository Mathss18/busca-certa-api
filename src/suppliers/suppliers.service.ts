import { Injectable } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return await this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async findOne(id: number): Promise<Supplier> {
    return this.prisma.supplier.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.prisma.supplier.update({
      data: updateSupplierDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<Supplier> {
    return this.prisma.supplier.delete({
      where: {
        id,
      },
    });
  }
}

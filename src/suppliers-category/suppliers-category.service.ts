import { Injectable } from '@nestjs/common';
import { SuppliersCategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateSuppliersCategoryDto } from './dto/create-suppliers-category.dto';
import { UpdateSuppliersCategoryDto } from './dto/update-suppliers-category.dto';

@Injectable()
export class SuppliersCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SuppliersCategory[]> {
    return this.prisma.suppliersCategory.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<SuppliersCategory> {
    return this.prisma.suppliersCategory.findFirst({
      where: {
        id,
      },
    });
  }

  async create(
    createSuppliersCategoryDto: CreateSuppliersCategoryDto,
  ): Promise<SuppliersCategory> {
    return await this.prisma.suppliersCategory.create({
      data: createSuppliersCategoryDto,
    });
  }

  async update(
    id: number,
    updateSuppliersCategoryDto: UpdateSuppliersCategoryDto,
  ): Promise<SuppliersCategory> {
    return this.prisma.suppliersCategory.update({
      data: updateSuppliersCategoryDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<SuppliersCategory> {
    return this.prisma.suppliersCategory.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { SuppliersCategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { applyDefaultOrder } from '../utils/applyDefaultOrder';
import { CreateSuppliersCategoryDto } from './dto/create-suppliers-category.dto';
import { UpdateSuppliersCategoryDto } from './dto/update-suppliers-category.dto';

@Injectable()
export class SuppliersCategoryService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<SuppliersCategory[]> {
    return this.prismaService.suppliersCategory.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: applyDefaultOrder(),
    });
  }

  async findOne(id: number): Promise<SuppliersCategory> {
    return this.prismaService.suppliersCategory.findFirst({
      where: {
        id,
      },
    });
  }

  async create(
    createSuppliersCategoryDto: CreateSuppliersCategoryDto,
  ): Promise<SuppliersCategory> {
    return await this.prismaService.suppliersCategory.create({
      data: createSuppliersCategoryDto,
    });
  }

  async update(
    id: number,
    updateSuppliersCategoryDto: UpdateSuppliersCategoryDto,
  ): Promise<SuppliersCategory> {
    return this.prismaService.suppliersCategory.update({
      data: updateSuppliersCategoryDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<SuppliersCategory> {
    return this.prismaService.suppliersCategory.delete({
      where: {
        id,
      },
    });
  }
}

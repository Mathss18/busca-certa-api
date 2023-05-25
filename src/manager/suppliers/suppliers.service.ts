import { Injectable } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UpdateSupplierActionAreasDto } from './dto/update-supplier-action-areas.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  async findOne(id: number): Promise<Supplier> {
    return this.prisma.supplier.findFirst({
      where: {
        id,
      },
    });
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
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

  async updateActionAreas(id: number, actionAreas: UpdateSupplierActionAreasDto): Promise<Supplier> {
    console.log(actionAreas.actionAreas);
    return this.prisma.supplier.update({
      data: {
        actionAreas: actionAreas.actionAreas as any,
      },
      where: {
        id,
      },
    });
  }
}

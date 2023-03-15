import { Injectable } from '@nestjs/common';
import { Prisma, ProductsCategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';

@Injectable()
export class ProductsCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProductsCategoryDto: CreateProductsCategoryDto,
  ): Promise<ProductsCategory> {
    return this.prismaService.productsCategory.create({
      data: createProductsCategoryDto,
    });
  }

  async findAll() {
    return this.prismaService.productsCategory.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.productsCategory.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateProductsCategoryDto: UpdateProductsCategoryDto,
  ) {
    return this.prismaService.productsCategory.update({
      where: {
        id,
      },
      data: updateProductsCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.productsCategory.delete({
      where: { id },
    });
  }
}

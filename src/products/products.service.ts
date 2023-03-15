import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto): Promise<Products> {
    return this.prismaService.products.create({
      data: createProductDto,
    });
  }

  findAll(): Promise<Products[]> {
    return this.prismaService.products.findMany();
  }

  findOne(id: number): Promise<Products> {
    return this.prismaService.products.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<Products> {
    return this.prismaService.products.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  remove(id: number): Promise<Products> {
    return this.prismaService.products.delete({
      where: {
        id,
      },
    });
  }
}

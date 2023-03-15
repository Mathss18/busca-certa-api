import { Injectable } from '@nestjs/common';
import { ProductVariations } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Injectable()
export class ProductVariationsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(
    createProductVariationDto: CreateProductVariationDto,
  ): Promise<ProductVariations> {
    return this.prismaService.productVariations.create({
      data: createProductVariationDto,
    });
  }

  findAll(): Promise<ProductVariations[]> {
    return this.prismaService.productVariations.findMany();
  }

  findOne(id: number): Promise<ProductVariations> {
    return this.prismaService.productVariations.findFirst({
      where: {
        id,
      },
    });
  }

  update(
    id: number,
    updateProductVariationDto: UpdateProductVariationDto,
  ): Promise<ProductVariations> {
    return this.prismaService.productVariations.update({
      where: {
        id,
      },
      data: updateProductVariationDto,
    });
  }

  remove(id: number): Promise<ProductVariations> {
    return this.prismaService.productVariations.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductVariationOptionDto } from './dto/create-product-variation-option.dto';
import { UpdateProductVariationOptionDto } from './dto/update-product-variation-option.dto';

@Injectable()
export class ProductVariationOptionsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(createProductVariationOptionDto: CreateProductVariationOptionDto) {
    return this.prismaService.productVariationOptions.create({
      data: createProductVariationOptionDto,
    });
  }

  findAll() {
    return this.prismaService.productVariationOptions.findMany();
  }

  findOne(id: number) {
    return this.prismaService.productVariationOptions.findFirst({
      where: {
        id,
      },
    });
  }

  update(
    id: number,
    updateProductVariationOptionDto: UpdateProductVariationOptionDto,
  ) {
    return this.prismaService.productVariationOptions.update({
      where: {
        id,
      },
      data: updateProductVariationOptionDto,
    });
  }

  remove(id: number) {
    return this.prismaService.productVariationOptions.delete({
      where: {
        id,
      },
    });
  }
}
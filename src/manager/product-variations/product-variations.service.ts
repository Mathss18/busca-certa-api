import { Injectable } from '@nestjs/common';
import { ProductVariations } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Injectable()
export class ProductVariationsService {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(
    createProductVariationDto: CreateProductVariationDto,
  ): Promise<ProductVariations> {
    const exists = await this.validateDuplicatedRow(
      createProductVariationDto.productId,
      createProductVariationDto.variationId,
    );
    if (exists) throw new Error('Cannot link the same variation option twice.');

    return this.prismaService.productVariations.create({
      data: createProductVariationDto,
    });
  }

  findAll(): Promise<ProductVariations[]> {
    return this.prismaService.productVariations.findMany({
      orderBy: applyDefaultOrder(),
    });
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

  private async validateDuplicatedRow(
    productId: number,
    variationId: number,
  ): Promise<boolean> {
    const exists = await this.prismaService.productVariations.findFirst({
      select: {
        id: true,
      },
      where: {
        productId,
        variationId,
      },
    });
    if (exists) {
      return true;
    }
    return false;
  }
}

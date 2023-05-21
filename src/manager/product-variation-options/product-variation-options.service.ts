import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateProductVariationOptionDto } from './dto/create-product-variation-option.dto';
import { UpdateProductVariationOptionDto } from './dto/update-product-variation-option.dto';

@Injectable()
export class ProductVariationOptionsService {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(createProductVariationOptionDto: CreateProductVariationOptionDto) {
    const exists = await this.validateDuplicatedRow(
      createProductVariationOptionDto.productVariationId,
      createProductVariationOptionDto.variationOptionId,
    );
    if (exists) throw new Error('Cannot link the same variation option twice.');

    return this.prismaService.productVariationOptions.create({
      data: createProductVariationOptionDto,
    });
  }

  findAll() {
    return this.prismaService.productVariationOptions.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  findOne(id: number) {
    return this.prismaService.productVariationOptions.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateProductVariationOptionDto: UpdateProductVariationOptionDto) {
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

  private async validateDuplicatedRow(productVariationId: number, variationOptionId: number): Promise<boolean> {
    const exists = await this.prismaService.productVariationOptions.findFirst({
      select: {
        id: true,
      },
      where: {
        productVariationId,
        variationOptionId,
      },
    });
    if (exists) {
      return true;
    }
    return false;
  }
}

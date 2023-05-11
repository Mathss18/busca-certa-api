import { Injectable } from '@nestjs/common';
import { VariationOptions } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateVariationOptionDto } from './dto/create-variation-option.dto';
import { UpdateVariationOptionDto } from './dto/update-variation-option.dto';

@Injectable()
export class VariationOptionsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(
    createVariationOptionDto: CreateVariationOptionDto,
  ): Promise<VariationOptions> {
    return this.prismaService.variationOptions.create({
      data: createVariationOptionDto,
    });
  }

  findAll(): Promise<VariationOptions[]> {
    return this.prismaService.variationOptions.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  findOne(id: number): Promise<VariationOptions> {
    return this.prismaService.variationOptions.findFirst({
      where: {
        id,
      },
    });
  }

  update(
    id: number,
    updateVariationOptionDto: UpdateVariationOptionDto,
  ): Promise<VariationOptions> {
    return this.prismaService.variationOptions.update({
      where: {
        id,
      },
      data: updateVariationOptionDto,
    });
  }

  remove(id: number): Promise<VariationOptions> {
    return this.prismaService.variationOptions.delete({
      where: {
        id,
      },
    });
  }
}

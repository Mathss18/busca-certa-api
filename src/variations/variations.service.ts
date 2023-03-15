import { Injectable } from '@nestjs/common';
import { Variations } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';

@Injectable()
export class VariationsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(createVariationDto: CreateVariationDto): Promise<Variations> {
    return this.prismaService.variations.create({
      data: createVariationDto,
    });
  }

  findAll(): Promise<Variations[]> {
    return this.prismaService.variations.findMany();
  }

  findOne(id: number): Promise<Variations> {
    return this.prismaService.variations.findFirst({
      where: {
        id,
      },
    });
  }

  update(
    id: number,
    updateVariationDto: UpdateVariationDto,
  ): Promise<Variations> {
    return this.prismaService.variations.update({
      where: {
        id,
      },
      data: updateVariationDto,
    });
  }

  remove(id: number): Promise<Variations> {
    return this.prismaService.variations.delete({
      where: {
        id,
      },
    });
  }
}

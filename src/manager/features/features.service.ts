import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { Features } from '@prisma/client';

@Injectable()
export class FeaturesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Features[]> {
    return this.prismaService.features.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  async findOne(id: number): Promise<Features> {
    return this.prismaService.features.findFirst({
      where: {
        id,
      },
    });
  }

  async create(createFeatureDto: CreateFeatureDto): Promise<Features> {
    return await this.prismaService.features.create({
      data: createFeatureDto,
    });
  }

  async update(id: number, updateFeatureDto: UpdateFeatureDto): Promise<Features> {
    return this.prismaService.features.update({
      data: updateFeatureDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<Features> {
    return this.prismaService.features.delete({
      where: {
        id,
      },
    });
  }
}

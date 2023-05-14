import { Injectable } from '@nestjs/common';
import { Keywords } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(createKeywordDto: CreateKeywordDto): Promise<Keywords> {
    createKeywordDto.name = createKeywordDto.name.toLowerCase();

    return this.prismaService.keywords.create({
      data: createKeywordDto,
    });
  }

  findAll(): Promise<Keywords[]> {
    return this.prismaService.keywords.findMany({
      orderBy: applyDefaultOrder(),
    });
  }

  findOne(id: number): Promise<Keywords> {
    return this.prismaService.keywords.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto): Promise<Keywords> {
    updateKeywordDto.name = updateKeywordDto.name.toLowerCase();

    return this.prismaService.keywords.update({
      where: {
        id,
      },
      data: updateKeywordDto,
    });
  }

  remove(id: number): Promise<Keywords> {
    return this.prismaService.keywords.delete({
      where: {
        id,
      },
    });
  }
}

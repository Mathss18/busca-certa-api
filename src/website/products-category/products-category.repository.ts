import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { FindRelevantsByTermParams, FindRelevantsParams } from './interfaces/products-category.interface';

@Injectable()
export class ProductsCategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findRelevants(params: FindRelevantsParams) {
    return this.prismaService.productsCategory.findMany({
      where: {
        image: {
          not: null,
        },
        active: { equals: true },
      },
      take: +params.quantity || 10,
      orderBy: applyDefaultOrder(),
    });
  }

  async findRelevantsByTerm(params: FindRelevantsByTermParams) {
    return await this.prismaService.productsCategory.findMany({
      where: {
        OR: [
          {
            name: {
              contains: params.term,
            },
          },
          {
            subcategories: {
              some: {
                name: {
                  contains: params.term,
                },
              },
            },
          },
          {
            products: {
              some: {
                name: {
                  contains: params.term,
                },
              },
            },
          },
          {
            products: {
              some: {
                supplier: {
                  OR: [
                    {
                      companyName: {
                        contains: params.term,
                      },
                    },
                    {
                      tradingName: {
                        contains: params.term,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        active: { equals: true },
      },
      take: +params.quantity || 10,
    });
  }
}

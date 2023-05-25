import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { FindRelevantsByTermParams, FindRelevantsParams } from './dto/products-category.dto';
import { FilerByLocationRepository } from '../shared/filter-by-location/filter-by-location';

@Injectable()
export class ProductsCategoryRepository extends FilerByLocationRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findRelevants(params: FindRelevantsParams) {
    const whereCondition = {
      image: {
        not: null,
      },
      active: { equals: true },
    };
    if (params.location) {
      whereCondition['products'] = {
        some: this.filterBySupplierActionAreas(params.location),
      };
    }
    return this.prismaService.productsCategory.findMany({
      where: whereCondition,
      take: +params.quantity || 10,
      orderBy: applyDefaultOrder(),
    });
  }

  async findRelevantsByTerm(params: FindRelevantsByTermParams) {
    const whereCondition = {
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
    };

    if (params.location) {
      whereCondition['products'] = {
        some: this.filterBySupplierActionAreas(params.location),
      };
    }

    return await this.prismaService.productsCategory.findMany({
      where: whereCondition,
      take: +params.quantity || 10,
    });
  }
}

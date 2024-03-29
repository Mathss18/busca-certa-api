import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { SearchByTermDto, SearchByTermPaginatedDto } from './dto/product.dto';
import { LocationDto } from '../../shared/dto/location.dto';
import { FilerByLocationRepository } from '../shared/filter-by-location/filter-by-location';

@Injectable()
export class ProductRepository extends FilerByLocationRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findProductByTerm(params: SearchByTermPaginatedDto) {
    const skip = (params.page - 1) * params.pageSize;

    const selectFields = {
      id: true,
      name: true,
      subtitle: true,
      image: true,
      brand: true,
      minimumToEstimate: true,
      supplier: {
        select: {
          companyName: true,
          logo: true,
          actionAreas: true,
        },
      },
      productsVariations: this.selectProductVariations(),
    };

    const searchTerm = params.term.toLowerCase();

    const count = await this.prismaService.products.count({ where: this.productsCondition(searchTerm, params.location) });
    const products = await this.prismaService.products.findMany({
      where: this.productsCondition(searchTerm, params.location),
      select: selectFields,
      take: params.pageSize,
      skip: skip,
      orderBy: applyDefaultOrder(),
    });

    return { products, count };
  }

  async findHighlightProductByTerm(params: SearchByTermDto) {
    const selectFields = {
      id: true,
      name: true,
      subtitle: true,
      image: true,
      brand: true,
      rating: true,
      productCategory: {
        select: {
          name: true,
        },
      },
      supplier: {
        select: {
          companyName: true,
          logo: true,
        },
      },
      productsVariations: this.selectProductVariations(),
    };

    const searchTerm = params.term.toLowerCase();

    return await this.prismaService.products.findFirst({
      where: this.productsCondition(searchTerm, params.location),
      select: selectFields,
      orderBy: applyDefaultOrder('rating', 'desc'),
    });
  }

  async findOne(id: number) {
    return await this.prismaService.products.findFirstOrThrow({
      where: {
        id,
        active: { equals: true },
      },
      select: {
        id: true,
        name: true,
        image: true,
        rating: true,
        subtitle: true,
        description: true,
        supplier: true,
        minimumToEstimate: true,
        productCategory: {
          select: {
            name: true,
          },
        },
        productsVariations: this.selectProductVariations(),
        productFeatures: {
          select: {
            features: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
      },
    });
  }

  private selectProductVariations() {
    return {
      where: {
        active: { equals: true },
      },
      select: {
        variation: {
          select: {
            id: true,
            name: true,
            active: true,
          },
        },
        productVariationOptions: {
          where: {
            active: { equals: true },
          },
          select: {
            variationOption: {
              select: {
                id: true,
                name: true,
                active: true,
              },
            },
          },
        },
      },
    };
  }

  private productsCondition(searchTerm: string, location?: LocationDto) {
    const condition = {
      OR: [
        {
          name: {
            contains: searchTerm,
          },
        },
        {
          supplier: {
            OR: [
              {
                companyName: {
                  contains: searchTerm,
                },
              },
              {
                tradingName: {
                  contains: searchTerm,
                },
              },
            ],
          },
        },
        {
          productCategory: {
            name: {
              contains: searchTerm,
            },
          },
        },
        {
          productCategory: {
            parent: {
              name: {
                contains: searchTerm,
              },
            },
          },
        },
        {
          productKeywords: {
            some: {
              keywords: {
                name: {
                  contains: searchTerm,
                },
              },
            },
          },
        },
      ],
      active: { equals: true },
    };

    if (location) {
      condition['AND'] = [this.filterBySupplierActionAreas(location)];
    }
    return condition;
  }
}

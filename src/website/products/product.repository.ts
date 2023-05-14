import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { SearchByTermDto, SearchByTermPaginatedDto } from './dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findProductByTerm(params: SearchByTermPaginatedDto) {
    const skip = (params.page - 1) * params.pageSize;

    const selectFields = {
      id: true,
      name: true,
      subtitle: true,
      image: true,
      brand: true,
      supplier: {
        select: {
          companyName: true,
          logo: true,
        },
      },
      productsVariations: this.selectProductVariations(),
    };

    const searchTerm = params.term.toLowerCase();

    const condition = {
      OR: [
        {
          name: {
            contains: searchTerm,
          },
        },
        {
          brand: {
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
    const count = await this.prismaService.products.count({ where: condition });
    const products = await this.prismaService.products.findMany({
      where: condition,
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
      where: this.productsCondition(searchTerm),
      select: selectFields,
      orderBy: applyDefaultOrder('rating', 'desc'),
    });
  }

  async findOne(id: number) {
    return await this.prismaService.products.findFirst({
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

  private productsCondition(searchTerm: string) {
    return {
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
      ],
      active: { equals: true },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { SearchByTermDto } from './dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findProductByTerm(params: SearchByTermDto) {
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

    const searchTerm = params.term.toLowerCase(); // Convert search term to lowercase

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
        productCategory: true,
        supplier: true,
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
}

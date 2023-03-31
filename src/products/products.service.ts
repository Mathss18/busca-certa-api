import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(protected readonly prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto): Promise<Products> {
    createProductDto.priceUpdatedAt = new Date();

    return this.prismaService.products.create({
      data: createProductDto,
    });
  }

  findAll(): Promise<Products[]> {
    return this.prismaService.products.findMany({
      include: {
        productCategory: true,
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }

  findOneWithVariations(id: number): Promise<Products> {
    return this.prismaService.products.findFirst({
      where: {
        id,
      },
      include: {
        productsVariations: {
          select: {
            id: true,
            active: true,
            variation: {
              select: {
                id: true,
                name: true,
                active: true,
                variationsOptions: {
                  select: {
                    id: true,
                    name: true,
                    active: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOneWithVariationsAndVariationOptions(
    id: number,
  ): Promise<Products> {
    const product = await this.prismaService.products.findFirst({
      where: {
        id,
      },
      include: {
        productsVariations: {
          include: {
            variation: {
              include: {
                variationsOptions: {
                  select: {
                    id: true,
                    name: true,
                    productsVariationOptions: {
                      where: {
                        productVariation: {
                          productId: id,
                        },
                      },
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Add a computed property to each VariationOption indicating whether it is linked to the product or not
    product.productsVariations.map((pv) => {
      pv.variation.variationsOptions.map((vo: any) => {
        vo.isLinked = vo.productsVariationOptions.length > 0;
      });
    });

    return product;
  }

  findOne(id: number): Promise<Products> {
    return this.prismaService.products.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<Products> {
    return this.prismaService.products.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  remove(id: number): Promise<Products> {
    return this.prismaService.products.delete({
      where: {
        id,
      },
    });
  }
}

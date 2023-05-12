import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { applyDefaultOrder } from '../../utils/applyDefaultOrder';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Products> {
    createProductDto.priceUpdatedAt = new Date();
    const productFeaturesIds = createProductDto.productFeatures;
    delete createProductDto.productFeatures; // Remove productFeatures from DTO

    const product = await this.prismaService.products.create({
      data: createProductDto as any,
    });

    // Create new productFeatures relations
    await this.createProductFeatures(product.id, productFeaturesIds);
    return product;
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
      orderBy: applyDefaultOrder(),
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
                  orderBy: applyDefaultOrder(),
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
      include: {
        productFeatures: {
          select: {
            features: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const productFeaturesIds = updateProductDto.productFeatures;
    delete updateProductDto.productFeatures; // Remove productFeatures from DTO

    // Update the product
    const updatedProduct = await this.prismaService.products.update({
      where: { id },
      data: updateProductDto as any,
    });

    // Delete all existing productFeatures relations
    await this.deleteProductFeatures(id);

    // Create new productFeatures relations
    await this.createProductFeatures(id, productFeaturesIds);

    return this.prismaService.products.findUnique({
      where: { id: updatedProduct.id },
    });
  }

  remove(id: number): Promise<Products> {
    return this.prismaService.products.delete({
      where: {
        id,
      },
    });
  }

  private async deleteProductFeatures(productId: number) {
    const existingFeatures = await this.prismaService.productFeatures.findMany({
      where: { productId },
    });

    await this.prismaService.$transaction(
      existingFeatures.map((feature) =>
        this.prismaService.productFeatures.delete({
          where: { id: feature.id },
        }),
      ),
    );
  }

  private async createProductFeatures(productId: number, featureIds: number[]) {
    await this.prismaService.$transaction(
      featureIds.map((featureId) =>
        this.prismaService.productFeatures.create({
          data: {
            productId,
            featuresId: featureId,
          },
        }),
      ),
    );
  }
}

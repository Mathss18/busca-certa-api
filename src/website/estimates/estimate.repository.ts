import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuid } from 'uuid';
import { CreateEstimateDto, CreateEstimateProductVariationDto } from './dto/estimate.dto';
import { EstimateStatuses } from './enum/estimate-statuses.enum';

@Injectable()
export class EstimateRepository {
  private prismaTransaction: any;
  constructor(private readonly prismaService: PrismaService) {}

  async create(params: CreateEstimateDto) {
    return await this.prismaService.$transaction(async (transaction) => {
      this.prismaTransaction = transaction;
      // 1. Create a new estimate
      const estimate = await this.createEstimate(params);

      // 2. Create estimate products variations
      await this.createEstimateProductsVariations(estimate.id, params.estimateProductVariations);

      return estimate;
    });
  }

  async accept(id: number, status: EstimateStatuses, price: number) {
    return this.prismaService.estimate.update({
      where: {
        id,
      },
      data: {
        status: status,
        price: price,
      },
    });
  }

  async decline(id: number, status: EstimateStatuses) {
    return this.prismaService.estimate.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });
  }

  async findWithVariationsAndEstimateInfo(id: number) {
    return this.prismaService.estimate.findFirst({
      where: {
        id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            subtitle: true,
            supplier: {
              select: {
                id: true,
                companyName: true,
                email: true,
                mobileNumber: true,
              },
            },
          },
        },
        estimateProductVariations: {
          select: {
            variation: {
              select: {
                name: true,
              },
            },
            variationOption: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getIdByNonce(nonce: string) {
    return this.prismaService.estimate.findFirstOrThrow({
      where: {
        nonce,
      },
      select: {
        id: true,
      },
    });
  }

  async getOneByNonce(nonce: string) {
    return this.prismaService.estimate.findFirstOrThrow({
      where: {
        nonce,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            subtitle: true,
            supplier: {
              select: {
                id: true,
                companyName: true,
                email: true,
              },
            },
          },
        },
        estimateProductVariations: {
          select: {
            variation: {
              select: {
                name: true,
              },
            },
            variationOption: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  private async createEstimate(params: CreateEstimateDto) {
    return this.prismaTransaction.estimate.create({
      data: {
        clientName: params.clientName,
        clientEmail: params.clientEmail,
        clientPhone: params.clientPhone,
        clientCompanyName: params.clientCompanyName,
        clientSegment: params.clientSegment,
        clientFile: params.clientFile,
        clientMessage: params.clientMessage,
        quantity: params.quantity,
        nonce: uuid(),
        product: {
          connect: {
            id: params.productId,
          },
        },
      },
    });
  }

  private async createEstimateProductsVariations(estimateId: number, variations: CreateEstimateProductVariationDto[]) {
    return this.prismaTransaction.estimateProductVariation.createMany({
      data: variations.map((variation) => ({
        estimateId: estimateId,
        variationId: variation.variationId,
        variationOptionId: variation.variationOptionId,
      })),
    });
  }
}

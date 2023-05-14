import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEstimateDto, CreateEstimateProductVariationDto, CreateEstimatesInfoDto } from './dto/estimate.dto';

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

      // 3. Create estimate info
      const estimateInfo = await this.createEstimateInfo({
        estimateId: estimate.id,
        sentClientEmail: null,
        sentSupplierEmail: null,
        sentClientWhatsapp: null,
        sentSupplierWhatsapp: null,
      });

      // 4. Update estimate with info id
      const updatedEstimate = await this.updateEstimateWithInfoId(estimate.id, estimateInfo.id);

      return updatedEstimate;
    });
  }

  async findWithVariationsAndEstimateInfo(id: number) {
    return this.prismaService.estimate.findFirst({
      where: {
        id,
      },
      include: {
        estimateInfo: true,
        product: {
          select: {
            id: true,
            name: true,
            image: true,
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

  private async createEstimateInfo(estimateInfo: CreateEstimatesInfoDto) {
    return this.prismaTransaction.estimatesInfo.create({
      data: {
        estimateId: estimateInfo.estimateId,
        sentClientEmail: estimateInfo.sentClientEmail,
        sentSupplierEmail: estimateInfo.sentSupplierEmail,
        sentClientWhatsapp: estimateInfo.sentClientWhatsapp,
        sentSupplierWhatsapp: estimateInfo.sentSupplierWhatsapp,
      },
    });
  }

  private async updateEstimateWithInfoId(estimateId: number, infoId: number) {
    return this.prismaTransaction.estimate.update({
      where: { id: estimateId },
      data: { estimateInfoId: infoId },
    });
  }
}

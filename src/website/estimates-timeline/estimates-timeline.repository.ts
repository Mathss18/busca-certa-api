import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EstimateTimelineCode } from './enum/estimate-timeline.enum';
import { CreateEstimateTimelineDto, UpdateEstimateTimelineDto } from './dto/estimate-timeline.dto';

@Injectable()
export class EstimatesTimelineRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(estimateInfo: CreateEstimateTimelineDto) {
    return this.prismaService.estimateTimeline.create({
      data: {
        estimateId: estimateInfo.estimateId,
        code: estimateInfo.code,
        message: estimateInfo.message,
      },
    });
  }

  async update(id: number, estimateInfo: UpdateEstimateTimelineDto) {
    return await this.prismaService.estimateTimeline.update({
      where: {
        id,
      },
      data: {
        code: estimateInfo.code,
        message: estimateInfo.message,
        updatedAt: estimateInfo.updatedAt ?? new Date(),
      },
    });
  }

  async getAckEventInTimeline(estimateId: number) {
    return this.prismaService.estimateTimeline.findFirst({
      where: {
        estimateId,
        code: EstimateTimelineCode.Events.SUPPLIER_ACK_ESTIMATE.CODE,
      },
    });
  }
}

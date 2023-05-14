import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { CreateEstimateDto } from './dto/estimate.dto';
import { HttpReturn } from '../../shared/http-response';
import { Response } from 'express';

@Controller('website/estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}

  @Post('/create')
  async create(@Body() createEstimateDto: CreateEstimateDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.create(createEstimateDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { AcceptEstimateDto, CreateEstimateDto, DeclineEstimateDto } from './dto/estimate.dto';
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

  @Get('/ack/:nonce')
  async ackEstimate(@Param('nonce') nonce: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.ackEstimate(nonce),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get('/nonce/:nonce')
  async getByNonce(@Param('nonce') nonce: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.getOneByNonce(nonce),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Post('/accept')
  async accept(@Body() acceptEstimateDto: AcceptEstimateDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.accept(acceptEstimateDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Post('/decline')
  async decline(@Body() declineEstimateDto: DeclineEstimateDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.decline(declineEstimateDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

import { Body, Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { AcceptEstimateDto, CreateEstimateDto, DeclineEstimateDto } from './dto/estimate.dto';
import { HttpReturn } from '../../shared/http-response';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Folder, S3Service } from '../../aws/s3/s3.service';
import { v4 as uuid } from 'uuid';
import { Throttle } from '@nestjs/throttler';

@Controller('website/estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService, private readonly s3Service: S3Service) {}

  @Throttle(5, 60)
  @Post('/create')
  @UseInterceptors(FileInterceptor('clientFile'))
  async create(
    @UploadedFile()
    clientFile: Express.Multer.File,
    @Body()
    createEstimateDto: CreateEstimateDto,
    @Res() res: Response,
  ) {
    let fileName = '';
    if (clientFile) {
      const extension = clientFile.mimetype.split('/')[1];
      fileName = `${createEstimateDto.clientName}-${uuid()}-file.${extension}`;

      /* Validations
       * 1- fileSize must be less than 4194304 bytes = 4MB
       * 2- extension must be one of the following: pdf, png, jpeg, csv
       */
      if (clientFile.size > 4194304) {
        return res.status(HttpStatus.BAD_REQUEST).json(HttpReturn.build({ success: false, message: 'File size is too big' }));
      }
      if (!['application/pdf', 'image/png', 'image/jpeg', 'text/csv'].includes(clientFile.mimetype)) {
        return res.status(HttpStatus.BAD_REQUEST).json(HttpReturn.build({ success: false, message: 'File type not allowed' }));
      }
    }
    try {
      if (clientFile) createEstimateDto.clientFile = await this.s3Service.upload(fileName, clientFile.buffer, Folder.ATTACHMENTS);

      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.estimatesService.create(createEstimateDto),
        }),
      );
    } catch (error) {
      if (clientFile) this.s3Service.delete(fileName);
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

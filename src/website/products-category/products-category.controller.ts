import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Body,
  Query,
  Post,
} from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';
import { Response } from 'express';
import { HttpReturn } from '../../shared/http-response';
import {
  FindRelevantsByTermParams,
  FindRelevantsParams,
} from './interfaces/products-category.interface';

@Controller('website/products-category')
export class ProductsCategoryController {
  constructor(
    private readonly productsCategoryService: ProductsCategoryService,
  ) {}

  @Get('find-relevants')
  async findRelevants(@Query() req: FindRelevantsParams, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.findRelevants(req),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get('find-relevants-by-term')
  async findRelevantsByTerm(
    @Query() req: FindRelevantsByTermParams,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.findRelevantsByTerm(req),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

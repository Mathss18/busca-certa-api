import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductVariationOptionsService } from './product-variation-options.service';
import { CreateProductVariationOptionDto } from './dto/create-product-variation-option.dto';
import { UpdateProductVariationOptionDto } from './dto/update-product-variation-option.dto';
import { Response } from 'express';
import { HttpReturn } from '../shared/http-response';

@Controller('product-variation-options')
export class ProductVariationOptionsController {
  constructor(
    private readonly productVariationOptionsService: ProductVariationOptionsService,
  ) {}

  @Post()
  async create(
    @Body() createProductVariationOptionDto: CreateProductVariationOptionDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productVariationOptionsService.create(
            createProductVariationOptionDto,
          ),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        HttpReturn.build({
          success: false,
          message: error.message,
        }),
      );
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productVariationOptionsService.findAll(),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        HttpReturn.build({
          success: false,
          message: error.message,
        }),
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productVariationOptionsService.findOne(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        HttpReturn.build({
          success: false,
          message: error.message,
        }),
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductVariationOptionDto: UpdateProductVariationOptionDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productVariationOptionsService.update(
            +id,
            updateProductVariationOptionDto,
          ),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        HttpReturn.build({
          success: false,
          message: error.message,
        }),
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productVariationOptionsService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        HttpReturn.build({
          success: false,
          message: error.message,
        }),
      );
    }
  }
}

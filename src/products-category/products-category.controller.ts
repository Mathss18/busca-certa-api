import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';
import { Response } from 'express';
import { HttpReturn } from '../shared/http-response';
import { Public } from '../decorators/public.decorator';

@Controller('products-category')
export class ProductsCategoryController {
  constructor(
    private readonly productsCategoryService: ProductsCategoryService,
  ) {}

  @Post()
  async create(
    @Body() createProductsCategoryDto: CreateProductsCategoryDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.create(
            createProductsCategoryDto,
          ),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.findAll(),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.findOne(+id),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductsCategoryDto: UpdateProductsCategoryDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.update(
            +id,
            updateProductsCategoryDto,
          ),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.remove(+id),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

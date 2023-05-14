import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpReturn } from '../../shared/http-response';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('manager/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.create(createProductDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.findAll(),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.findOne(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.update(+id, updateProductDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get(':id/variations')
  async findOneWithVariationsAndVariationOptions(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.findOneWithVariationsAndVariationOptions(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}
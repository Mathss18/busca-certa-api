import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpReturn } from '../../shared/http-response';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../aws/s3/s3.service';

@UseGuards(JwtAuthGuard)
@Controller('manager/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile()
    image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const extension = image.mimetype.split('/')[1];
    const fileName = `${createProductDto.name}-${createProductDto.supplierId}-product.${extension}`;
    try {
      createProductDto.image = await this.s3Service.upload(fileName, image.buffer);
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsService.create(createProductDto),
        }),
      );
    } catch (error) {
      this.s3Service.delete(fileName);
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile()
    image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      if (image) {
        const extension = image.mimetype.split('/')[1];
        const fileName = `${updateProductDto.name}-${updateProductDto.supplierId}-product.${extension}`;
        updateProductDto.image = await this.s3Service.upload(fileName, image.buffer);
      }
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

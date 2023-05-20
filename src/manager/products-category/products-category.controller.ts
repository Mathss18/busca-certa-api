import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';
import { Response } from 'express';
import { HttpReturn } from '../../shared/http-response';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../aws/s3/s3.service';

@UseGuards(JwtAuthGuard)
@Controller('manager/products-category')
export class ProductsCategoryController {
  constructor(private readonly productsCategoryService: ProductsCategoryService, private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile()
    image: Express.Multer.File,
    @Body() createProductsCategoryDto: CreateProductsCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const extension = image.mimetype.split('/')[1];
      const fileName = `${createProductsCategoryDto.name}-product-category.${extension}`;
      createProductsCategoryDto.image = await this.s3Service.upload(fileName, image.buffer);
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.create(createProductsCategoryDto),
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
          data: await this.productsCategoryService.findAll(),
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
          data: await this.productsCategoryService.findOne(+id),
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
    @Body() updateProductsCategoryDto: UpdateProductsCategoryDto,
    @Res() res: Response,
  ) {
    try {
      if (image) {
        const extension = image.mimetype.split('/')[1];
        const fileName = `${updateProductsCategoryDto.name}-product-category.${extension}`;
        updateProductsCategoryDto.image = await this.s3Service.upload(fileName, image.buffer);
      }
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.productsCategoryService.update(+id, updateProductsCategoryDto),
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
          data: await this.productsCategoryService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

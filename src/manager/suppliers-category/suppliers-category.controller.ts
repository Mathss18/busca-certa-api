import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { SuppliersCategoryService } from './suppliers-category.service';
import { CreateSuppliersCategoryDto } from './dto/create-suppliers-category.dto';
import { UpdateSuppliersCategoryDto } from './dto/update-suppliers-category.dto';
import { HttpReturn } from '../../shared/http-response';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('manager/suppliers-category')
export class SuppliersCategoryController {
  constructor(private readonly suppliersCategoryService: SuppliersCategoryService) {}

  @Post()
  async create(@Body() createSuppliersCategoryDto: CreateSuppliersCategoryDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersCategoryService.create(createSuppliersCategoryDto),
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
          data: await this.suppliersCategoryService.findAll(),
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
          data: await this.suppliersCategoryService.findOne(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSuppliersCategoryDto: UpdateSuppliersCategoryDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersCategoryService.update(+id, updateSuppliersCategoryDto),
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
          data: await this.suppliersCategoryService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

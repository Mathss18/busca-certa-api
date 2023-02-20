import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierValidator } from './validator/create-supplier.validator';
import { Response } from 'express';
import { HttpReturn } from 'src/shared/http-response';
import { UpdateSupplierValidator } from './validator/update-supplier.validator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      new CreateSupplierValidator(createSupplierDto).validate();
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersService.create(createSupplierDto),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      return res
        .status(HttpStatus.OK)
        .json(
          HttpReturn.build({ data: await this.suppliersService.findAll() }),
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
      return res
        .status(HttpStatus.OK)
        .json(
          HttpReturn.build({ data: await this.suppliersService.findOne(+id) }),
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
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      new UpdateSupplierValidator(updateSupplierDto).validate();
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersService.update(+id, updateSupplierDto),
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
          data: await this.suppliersService.remove(+id),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

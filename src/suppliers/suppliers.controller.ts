import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierValidator } from './validator/create-supplier.validator';
import { Response } from 'express';
import { HttpReturn } from 'src/shared/http-response';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto, @Res() res: Response) {
    const errorMessage = new CreateSupplierValidator(
      createSupplierDto,
    ).validate();

    if (errorMessage) {
      return res
        .status(HttpStatus.OK)
        .json(HttpReturn.build({ success: false, message: errorMessage }));
    }

    return res.status(HttpStatus.OK).json(
      HttpReturn.build({
        data: this.suppliersService.create(createSupplierDto),
      }),
    );
  }

  @Get()
  findAll(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(HttpReturn.build({ data: this.suppliersService.findAll() }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}

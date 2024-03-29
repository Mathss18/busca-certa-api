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
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Response } from 'express';
import { HttpReturn } from '../../shared/http-response';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Folder, S3Service } from '../../aws/s3/s3.service';
import { UpdateSupplierActionAreasDto } from './dto/update-supplier-action-areas.dto';

@UseGuards(JwtAuthGuard)
@Controller('manager/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService, private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @UploadedFile()
    logo: Express.Multer.File,
    @Body() createSupplierDto: CreateSupplierDto,
    @Res() res: Response,
  ) {
    const extension = logo.mimetype.split('/')[1];
    const fileName = `${createSupplierDto.cnpj}-logo.${extension}`;
    createSupplierDto.logo = await this.s3Service.upload(fileName, logo.buffer, Folder.SUPPLIERS);
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersService.create(createSupplierDto),
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
      return res.status(HttpStatus.OK).json(HttpReturn.build({ data: await this.suppliersService.findAll() }));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(HttpReturn.build({ data: await this.suppliersService.findOne(+id) }));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @UploadedFile()
    logo: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    try {
      if (logo) {
        const extension = logo.mimetype.split('/')[1];
        const fileName = `${updateSupplierDto.cnpj}-logo.${extension}`;
        updateSupplierDto.logo = await this.s3Service.upload(fileName, logo.buffer, Folder.SUPPLIERS);
      }

      if (Object.prototype.hasOwnProperty.call(updateSupplierDto, 'actionAreas')) delete updateSupplierDto.actionAreas;

      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersService.update(+id, updateSupplierDto),
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
          data: await this.suppliersService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Patch(':id/action-areas')
  async updateActionAreas(@Param('id') id: string, @Body() updateActionAreasDto: UpdateSupplierActionAreasDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.suppliersService.updateActionAreas(+id, updateActionAreasDto),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

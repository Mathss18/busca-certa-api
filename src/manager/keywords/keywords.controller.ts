import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Response } from 'express';
import { HttpReturn } from '../../shared/http-response';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { KeywordsService } from './keywords.service';

@UseGuards(JwtAuthGuard)
@Controller('manager/keywords')
export class KeywordsController {
  constructor(private readonly keywordService: KeywordsService) {}

  @Post()
  async create(@Body() createKeywordDto: CreateKeywordDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.keywordService.create(createKeywordDto),
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
          data: await this.keywordService.findAll(),
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
          data: await this.keywordService.findOne(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateKeywordDto: UpdateKeywordDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpReturn.build({
          data: await this.keywordService.update(+id, updateKeywordDto),
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
          data: await this.keywordService.remove(+id),
        }),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(HttpReturn.build({ success: false, message: error.message }));
    }
  }
}

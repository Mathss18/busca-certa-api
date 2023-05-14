import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { PrismaService } from '../../database/prisma.service';
import { KeywordsController } from './keywords.controller';

@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService, PrismaService],
})
export class KeywordsModule {}

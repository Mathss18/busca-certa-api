import { Module } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { EstimatesController } from './estimates.controller';
import { PrismaService } from '../../database/prisma.service';
import { EstimateRepository } from './estimate.repository';
import { EstimateListener } from './listeners/estimate.listener';
import { MailModule } from '../../mail/mail.module';

@Module({
  controllers: [EstimatesController],
  providers: [EstimatesService, PrismaService, EstimateRepository, EstimateListener],
  imports: [MailModule],
})
export class EstimatesModule {}

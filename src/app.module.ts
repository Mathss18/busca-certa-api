import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerModule } from './manager/manager.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [ManagerModule, WebsiteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

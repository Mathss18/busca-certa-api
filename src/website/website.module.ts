import { Module } from '@nestjs/common';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { ProductModule } from './products/product.module';
import { EstimatesModule } from './estimates/estimates.module';
import { EstimatesTimelineService } from './estimates-timeline/estimates-timeline.service';
import { EstimatesTimelineModule } from './estimates-timeline/estimates-timeline.module';

@Module({
  imports: [ProductsCategoryModule, ProductModule, EstimatesModule, EstimatesTimelineModule],
  controllers: [],
  providers: [EstimatesTimelineService],
})
export class WebsiteModule {}

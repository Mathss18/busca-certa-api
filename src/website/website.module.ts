import { Module } from '@nestjs/common';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { ProductModule } from './products/product.module';
import { EstimatesModule } from './estimates/estimates.module';

@Module({
  imports: [ProductsCategoryModule, ProductModule, EstimatesModule],
  controllers: [],
  providers: [],
})
export class WebsiteModule {}

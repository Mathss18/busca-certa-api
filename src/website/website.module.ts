import { Module } from '@nestjs/common';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [ProductsCategoryModule, ProductModule],
  controllers: [],
  providers: [],
})
export class WebsiteModule {}

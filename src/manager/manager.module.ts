import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SuppliersCategoryModule } from './suppliers-category/suppliers-category.module';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { VariationsModule } from './variations/variations.module';
import { VariationOptionsModule } from './variation-options/variation-options.module';
import { ProductVariationsModule } from './product-variations/product-variations.module';
import { ProductVariationOptionsModule } from './product-variation-options/product-variation-options.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { FeaturesModule } from './features/features.module';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [
    ProductsModule,
    SuppliersModule,
    SuppliersCategoryModule,
    ProductsCategoryModule,
    VariationsModule,
    VariationOptionsModule,
    ProductVariationsModule,
    ProductVariationOptionsModule,
    AuthModule,
    UsersModule,
    FeaturesModule,
    KeywordsModule,
  ],
  controllers: [],
  providers: [AuthService, JwtService, LocalStrategy],
})
export class ManagerModule {}

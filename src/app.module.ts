import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SuppliersCategoryModule } from './suppliers-category/suppliers-category.module';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { ProductsModule } from './products/products.module';
import { VariationsModule } from './variations/variations.module';
import { VariationOptionsModule } from './variation-options/variation-options.module';
import { ProductVariationsModule } from './product-variations/product-variations.module';
import { ProductVariationOptionsModule } from './product-variation-options/product-variation-options.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    SuppliersModule,
    SuppliersCategoryModule,
    ProductsCategoryModule,
    ProductsModule,
    VariationsModule,
    VariationOptionsModule,
    ProductVariationsModule,
    ProductVariationOptionsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

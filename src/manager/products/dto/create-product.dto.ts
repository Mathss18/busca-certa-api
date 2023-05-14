import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  brand: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  priceUpdatedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  supplierId: number;

  @IsNotEmpty()
  @IsNumber()
  productCategoryId: number;

  @IsArray()
  productFeatures: number[];

  @IsArray()
  productKeywords: number[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

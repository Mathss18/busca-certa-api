import { Transform } from 'class-transformer';
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
  image?: any;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minimumToEstimate: number;

  @IsOptional()
  priceUpdatedAt: Date;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  supplierId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  productCategoryId: number;

  @IsArray()
  @Transform(({ value }) => value.map(Number))
  productFeatures: number[];

  @IsArray()
  @Transform(({ value }) => value.map(Number))
  productKeywords: number[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

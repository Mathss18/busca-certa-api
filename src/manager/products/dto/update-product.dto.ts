import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

export class UpdateProductDto {
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
  @Transform(({ value }) => {
    if (value[0] === '__EMPTY_ARRAY__') return [];
    return value.map(Number);
  })
  productFeatures: number[];

  @IsArray()
  @Transform(({ value }) => {
    if (value[0] === '__EMPTY_ARRAY__') return [];
    return value.map(Number);
  })
  productKeywords: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  active?: boolean;
}

import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @MaxLength(255)
  subtitle: string;

  @IsString()
  @MaxLength(255)
  brand: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsUrl()
  image?: string;

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

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

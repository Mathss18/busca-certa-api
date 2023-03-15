import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductVariationDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  variationId: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

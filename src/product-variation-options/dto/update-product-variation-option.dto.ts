import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductVariationOptionDto {
  @IsNumber()
  @IsNotEmpty()
  productVariationId: number;

  @IsNumber()
  @IsNotEmpty()
  variationOptionId: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

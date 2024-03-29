import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVariationOptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @IsNumber()
  variationId: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

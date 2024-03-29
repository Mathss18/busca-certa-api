import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, IsEmail, IsDecimal, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEstimateProductVariationDto {
  @IsNotEmpty()
  @IsInt()
  variationId: number;

  @IsNotEmpty()
  @IsInt()
  variationOptionId: number;
}
export class CreateEstimateDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  clientPhone: string;

  @IsNotEmpty()
  @IsString()
  clientCompanyName: string;

  @IsOptional()
  @IsString()
  clientSegment?: string;

  @IsOptional()
  clientFile?: string;

  @IsOptional()
  @IsString()
  clientMessage?: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  quantity: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return JSON.parse(value);
    return value;
  })
  @ValidateNested({ each: true })
  @Type(() => CreateEstimateProductVariationDto)
  estimateProductVariations?: CreateEstimateProductVariationDto[];
}

export class AcceptEstimateDto {
  @IsNotEmpty()
  @IsString()
  nonce: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class DeclineEstimateDto {
  @IsNotEmpty()
  @IsString()
  nonce: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class AskForHelpWithEstimateDto {
  @IsNotEmpty()
  @IsString()
  nonce: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}

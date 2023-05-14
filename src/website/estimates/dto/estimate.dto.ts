import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEstimateProductVariationDto {
  @IsNotEmpty()
  @IsInt()
  variationId: number;

  @IsNotEmpty()
  @IsInt()
  variationOptionId: number;
}

export class CreateEstimatesInfoDto {
  @IsNotEmpty()
  @IsInt()
  estimateId: number;

  @IsNotEmpty()
  sentClientEmail: Date | null;

  @IsNotEmpty()
  sentSupplierEmail: Date | null;

  @IsNotEmpty()
  sentClientWhatsapp: Date | null;

  @IsNotEmpty()
  sentSupplierWhatsapp: Date | null;
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
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEstimateProductVariationDto)
  estimateProductVariations?: CreateEstimateProductVariationDto[];
}

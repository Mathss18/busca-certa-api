import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProductsCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

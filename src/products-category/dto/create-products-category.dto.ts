import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductsCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

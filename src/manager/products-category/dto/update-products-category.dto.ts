import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductsCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @IsOptional()
  image?: string;

  @Transform(({ value }) => {
    if (value === null) return value;
    Number(value);
  })
  @IsOptional()
  parentId?: number;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  active?: boolean;
}

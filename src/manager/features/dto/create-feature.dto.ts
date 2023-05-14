import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  name: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

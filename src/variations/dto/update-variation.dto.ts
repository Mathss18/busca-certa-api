import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateVariationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

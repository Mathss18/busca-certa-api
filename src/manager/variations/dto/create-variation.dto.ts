import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVariationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

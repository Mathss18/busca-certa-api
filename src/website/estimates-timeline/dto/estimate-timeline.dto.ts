import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, IsEmail } from 'class-validator';

export class CreateEstimateTimelineDto {
  @IsNotEmpty()
  @IsInt()
  estimateId: number;

  @IsOptional()
  @IsString()
  message?: string | null;

  @IsNotEmpty()
  @IsInt()
  code: number | null;
}

export class UpdateEstimateTimelineDto {
  @IsOptional()
  @IsString()
  message?: string | null;

  @IsNotEmpty()
  @IsInt()
  code: number | null;

  @IsOptional()
  updatedAt?: Date | string;
}

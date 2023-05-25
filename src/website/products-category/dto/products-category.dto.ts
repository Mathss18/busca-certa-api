import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { LocationDto } from '../../../shared/dto/location.dto';

export class FindRelevantsByTermParams {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  term: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  quantity: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

export class FindRelevantsParams {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  quantity: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { PaginatedRouteDto } from '../../../shared/dto/paginated-route.dto';
import { Type } from 'class-transformer';
import { LocationDto } from '../../../shared/dto/location.dto';

export class SearchByTermPaginatedDto extends PaginatedRouteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  term: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

export class SearchByTermDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  term: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

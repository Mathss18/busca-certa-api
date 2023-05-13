import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PaginatedRouteDto } from '../../../shared/dto/paginated-route.dto';

export class SearchByTermPaginatedDto extends PaginatedRouteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  term: string;
}

export class SearchByTermDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  term: string;
}

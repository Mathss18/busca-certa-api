import { IsNumber, Min } from 'class-validator';

export class PaginatedRouteDto {
  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  pageSize: number;
}

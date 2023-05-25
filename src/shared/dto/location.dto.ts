import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  city: string;
}

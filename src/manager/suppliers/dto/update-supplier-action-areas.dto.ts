import { ArrayNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ActionArea {
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city: string | null;
}

export class UpdateSupplierActionAreasDto {
  @ValidateNested({ each: true })
  @Type(() => ActionArea)
  actionAreas: ActionArea[];
}

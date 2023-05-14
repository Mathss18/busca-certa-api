import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  tradingName: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  segment: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  description: string;

  @IsOptional()
  logo?: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

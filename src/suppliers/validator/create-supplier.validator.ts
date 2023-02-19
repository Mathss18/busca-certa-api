import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Validator } from 'src/shared/validator';

export class CreateSupplierValidator extends Validator {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
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
  website: string;

  @IsString()
  description: string;

  @IsOptional()
  logo: string;

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
  active: boolean;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor({
    companyName,
    tradingName,
    cnpj,
    email,
    phoneNumber,
    mobileNumber,
    adress,
    segment,
    website,
    description,
    logo,
    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
    active,
  }: any) {
    super();
    Object.assign(this, {
      companyName,
      tradingName,
      cnpj,
      email,
      phoneNumber,
      mobileNumber,
      adress,
      segment,
      website,
      description,
      logo,
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      active,
    });
  }
}

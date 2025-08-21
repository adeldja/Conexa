import {
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
  IsDecimal,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class CreateProviderProfileDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  phone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDecimal()
  defaultPrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsObject()
  defaultSchedule?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

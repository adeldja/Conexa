import { IsOptional, IsString, IsDateString, IsPhoneNumber, IsObject } from 'class-validator';

export class CreateClientProfileDto {
  @IsOptional()
  @IsPhoneNumber('FR')
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}

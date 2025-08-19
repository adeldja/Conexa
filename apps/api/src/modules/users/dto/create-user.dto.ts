import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    enum: ['ADMIN', 'CLIENT', 'PROVIDER'],
    example: 'CLIENT',
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'Europe/Paris', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;
}

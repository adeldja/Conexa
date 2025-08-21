import { IsString, IsOptional } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

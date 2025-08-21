import { IsString, IsOptional } from 'class-validator';

export class AddProviderSpecialtyDto {
  @IsString()
  specialtyId: string;

  @IsOptional()
  @IsString()
  level?: string; // "Débutant", "Intermédiaire", "Expert"

  @IsOptional()
  @IsString()
  certification?: string;
}

import { IsString, IsOptional } from 'class-validator';

export class AddProviderSpecialtyDto {
  @IsOptional()
  @IsString()
  userId?: string; // Temporaire pour les tests

  @IsString()
  specialtyId: string;

  @IsOptional()
  @IsString()
  level?: string; // "Débutant", "Intermédiaire", "Expert"

  @IsOptional()
  @IsString()
  certification?: string;
}

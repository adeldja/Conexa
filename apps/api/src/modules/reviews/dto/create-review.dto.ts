import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  clientId?: string; // Temporaire pour les tests

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  bookingId?: string;
}

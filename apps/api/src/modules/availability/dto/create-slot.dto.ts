import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSlotDto {
  @ApiProperty({ example: 'uuid-provider-id' })
  @IsString()
  providerId: string;

  @ApiProperty({ example: '2025-07-01T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-07-01T10:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

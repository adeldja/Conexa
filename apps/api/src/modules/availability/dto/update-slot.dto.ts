import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { CreateSlotDto } from './create-slot.dto';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {
  @ApiProperty({ example: '2025-07-01T09:30:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ example: '2025-07-01T10:30:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

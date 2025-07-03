import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  slotId: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;
}

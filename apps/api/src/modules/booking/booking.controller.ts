import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    console.log('Received request to create booking:', createBookingDto);
    try {
      const result = await this.bookingService.create(createBookingDto);
      console.log('Booking created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in create booking controller:', error);
      throw error;
    }
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all bookings for a client' })
  @ApiResponse({ status: 200, description: 'List of bookings returned successfully' })
  findByClient(@Param('clientId') clientId: string) {
    return this.bookingService.findByClient(clientId);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get all bookings for a provider' })
  @ApiResponse({ status: 200, description: 'List of bookings returned successfully' })
  findByProvider(@Param('providerId') providerId: string) {
    return this.bookingService.findByProvider(providerId);
  }

  @Get('slot/:slotId')
  @ApiOperation({ summary: 'Get all bookings for a slot' })
  @ApiResponse({ status: 200, description: 'List of bookings returned successfully' })
  findBySlot(@Param('slotId') slotId: string) {
    return this.bookingService.findBySlot(slotId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }
}

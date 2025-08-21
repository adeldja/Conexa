import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AvailabilityService } from './availability.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@ApiTags('availability')
@Controller('availability')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new availability slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  async create(@Body() createSlotDto: CreateSlotDto) {
    try {
      const result = await this.availabilityService.create(createSlotDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get all slots for a provider' })
  @ApiResponse({
    status: 200,
    description: 'List of slots returned successfully',
  })
  findByProvider(@Param('providerId') providerId: string) {
    return this.availabilityService.findByProvider(providerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific slot by ID' })
  @ApiResponse({ status: 200, description: 'Slot found' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a slot' })
  @ApiResponse({ status: 200, description: 'Slot updated successfully' })
  update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return this.availabilityService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a slot' })
  @ApiResponse({ status: 200, description: 'Slot deleted successfully' })
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}

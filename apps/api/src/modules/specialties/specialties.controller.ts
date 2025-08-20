import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { AddProviderSpecialtyDto } from './dto/add-provider-specialty.dto';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  // === SPECIALTIES CRUD ===

  @Post()
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtiesService.create(createSpecialtyDto);
  }

  @Get()
  findAll() {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialtiesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtiesService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialtiesService.remove(id);
  }

  // === PROVIDER SPECIALTIES ===

  @Post('provider/:providerId')
  addProviderSpecialty(
    @Param('providerId') providerId: string,
    @Request() req: any,
    @Body() addProviderSpecialtyDto: AddProviderSpecialtyDto,
  ) {
    const currentUserId = req.user?.id || req.body.userId; // Temporaire pour les tests
    return this.specialtiesService.addProviderSpecialty(providerId, currentUserId, addProviderSpecialtyDto);
  }

  @Delete('provider/:providerId/:specialtyId')
  removeProviderSpecialty(
    @Param('providerId') providerId: string,
    @Param('specialtyId') specialtyId: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.id || req.body.userId; // Temporaire pour les tests
    return this.specialtiesService.removeProviderSpecialty(providerId, specialtyId, currentUserId);
  }

  @Get('provider/:providerId')
  getProviderSpecialties(@Param('providerId') providerId: string) {
    return this.specialtiesService.getProviderSpecialties(providerId);
  }
}

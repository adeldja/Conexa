import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('seeder')
@UseGuards(AdminGuard) // Protéger toutes les routes avec un guard admin
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('specialties')
  async seedSpecialties() {
    return this.seederService.seedSpecialties();
  }

  @Post('users')
  async seedUsers() {
    return this.seederService.seedUsers();
  }

  @Post('profiles')
  async seedProfiles() {
    return this.seederService.seedProfiles();
  }

  @Post('slots')
  async seedSlots() {
    return this.seederService.seedSlots();
  }

  @Post('bookings')
  async seedBookings() {
    return this.seederService.seedBookings();
  }

  @Post('reviews')
  async seedReviews() {
    return this.seederService.seedReviews();
  }

  @Post('provider-specialties')
  async seedProviderSpecialties() {
    return this.seederService.seedProviderSpecialties();
  }

  @Post('all')
  async seedAll() {
    return this.seederService.seedAll();
  }

  @Post('reset')
  async resetDatabase() {
    return this.seederService.resetDatabase();
  }

  @Delete(':entity')
  async cleanData(@Param('entity') entity: string) {
    return this.seederService.cleanData(entity);
  }

  @Get('stats')
  async getStats() {
    return this.seederService.getStats();
  }
}

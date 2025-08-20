import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

// Import du guard d'authentification (à adapter selon votre implémentation)
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profiles')
// @UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // === CLIENT PROFILES ===

  @Post('client')
  async createClientProfile(
    @Request() req: any,
    @Body() createClientProfileDto: CreateClientProfileDto,
  ) {
    const userId = req.user?.id || req.body.userId; // Temporaire pour les tests
    return this.profilesService.createClientProfile(userId, createClientProfileDto);
  }

  @Get('client/:userId')
  async getClientProfile(@Param('userId') userId: string) {
    return this.profilesService.getClientProfile(userId);
  }

  @Put('client/:userId')
  async updateClientProfile(
    @Param('userId') userId: string,
    @Request() req: any,
    @Body() updateClientProfileDto: UpdateClientProfileDto,
  ) {
    const currentUserId = req.user?.id || userId; // Temporaire pour les tests
    return this.profilesService.updateClientProfile(userId, currentUserId, updateClientProfileDto);
  }

  // === PROVIDER PROFILES ===

  @Post('provider')
  async createProviderProfile(
    @Request() req: any,
    @Body() createProviderProfileDto: CreateProviderProfileDto,
  ) {
    const userId = req.user?.id || req.body.userId; // Temporaire pour les tests
    return this.profilesService.createProviderProfile(userId, createProviderProfileDto);
  }

  @Get('provider/:userId')
  async getProviderProfile(@Param('userId') userId: string) {
    return this.profilesService.getProviderProfile(userId);
  }

  @Put('provider/:userId')
  async updateProviderProfile(
    @Param('userId') userId: string,
    @Request() req: any,
    @Body() updateProviderProfileDto: UpdateProviderProfileDto,
  ) {
    const currentUserId = req.user?.id || userId; // Temporaire pour les tests
    return this.profilesService.updateProviderProfile(userId, currentUserId, updateProviderProfileDto);
  }

  // === RECHERCHE PRESTATAIRES ===

  @Get('providers/search')
  async searchProviders(
    @Query('query') query?: string,
    @Query('specialtyId') specialtyId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.profilesService.searchProviders(query, specialtyId, page, limit);
  }
}

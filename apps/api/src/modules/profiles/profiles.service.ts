import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // === CLIENT PROFILES ===

  async createClientProfile(
    userId: string,
    createClientProfileDto: CreateClientProfileDto,
  ) {
    // Vérifier que l'utilisateur existe et qu'il n'a pas déjà un profil client
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.clientProfile) {
      throw new ConflictException(
        'Un profil client existe déjà pour cet utilisateur',
      );
    }

    const clientProfile = await this.prisma.clientProfile.create({
      data: {
        userId,
        ...createClientProfileDto,
        dateOfBirth: createClientProfileDto.dateOfBirth
          ? new Date(createClientProfileDto.dateOfBirth)
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return clientProfile;
  }

  async getClientProfile(userId: string) {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!clientProfile) {
      throw new NotFoundException('Profil client non trouvé');
    }

    return clientProfile;
  }

  async updateClientProfile(
    userId: string,
    currentUserId: string,
    updateClientProfileDto: UpdateClientProfileDto,
  ) {
    // Vérifier que l'utilisateur peut modifier ce profil
    if (userId !== currentUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre profil',
      );
    }

    const existingProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profil client non trouvé');
    }

    const updatedProfile = await this.prisma.clientProfile.update({
      where: { userId },
      data: {
        ...updateClientProfileDto,
        dateOfBirth: updateClientProfileDto.dateOfBirth
          ? new Date(updateClientProfileDto.dateOfBirth)
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return updatedProfile;
  }

  // === PROVIDER PROFILES ===

  async createProviderProfile(
    userId: string,
    createProviderProfileDto: CreateProviderProfileDto,
  ) {
    // Vérifier que l'utilisateur existe et qu'il n'a pas déjà un profil prestataire
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { providerProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.providerProfile) {
      throw new ConflictException(
        'Un profil prestataire existe déjà pour cet utilisateur',
      );
    }

    const providerProfile = await this.prisma.providerProfile.create({
      data: {
        userId,
        ...createProviderProfileDto,
        defaultPrice: createProviderProfileDto.defaultPrice
          ? Number(createProviderProfileDto.defaultPrice)
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return providerProfile;
  }

  async getProviderProfile(userId: string) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!providerProfile) {
      throw new NotFoundException('Profil prestataire non trouvé');
    }

    return providerProfile;
  }

  async updateProviderProfile(
    userId: string,
    currentUserId: string,
    updateProviderProfileDto: UpdateProviderProfileDto,
  ) {
    // Vérifier que l'utilisateur peut modifier ce profil
    if (userId !== currentUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre profil',
      );
    }

    const existingProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profil prestataire non trouvé');
    }

    const updatedProfile = await this.prisma.providerProfile.update({
      where: { userId },
      data: {
        ...updateProviderProfileDto,
        defaultPrice: updateProviderProfileDto.defaultPrice
          ? Number(updateProviderProfileDto.defaultPrice)
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return updatedProfile;
  }

  // === RECHERCHE PRESTATAIRES ===

  async searchProviders(
    query?: string,
    specialtyId?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { businessName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { user: { fullName: { contains: query, mode: 'insensitive' } } },
      ];
    }

    if (specialtyId) {
      whereClause.specialties = {
        some: {
          specialtyId,
        },
      };
    }

    const [providers, total] = await Promise.all([
      this.prisma.providerProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          specialties: {
            include: {
              specialty: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [{ averageRating: 'desc' }, { totalBookings: 'desc' }],
      }),
      this.prisma.providerProfile.count({ where: whereClause }),
    ]);

    return {
      providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

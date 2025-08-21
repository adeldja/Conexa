import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { AddProviderSpecialtyDto } from './dto/add-provider-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(private readonly prisma: PrismaService) {}

  // === SPECIALTIES CRUD ===

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    // Vérifier que la spécialité n'existe pas déjà
    const existingSpecialty = await this.prisma.specialty.findUnique({
      where: { name: createSpecialtyDto.name },
    });

    if (existingSpecialty) {
      throw new ConflictException('Une spécialité avec ce nom existe déjà');
    }

    return this.prisma.specialty.create({
      data: createSpecialtyDto,
    });
  }

  async findAll() {
    return this.prisma.specialty.findMany({
      include: {
        _count: {
          select: { providers: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
      include: {
        providers: {
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { providers: true },
        },
      },
    });

    if (!specialty) {
      throw new NotFoundException('Spécialité non trouvée');
    }

    return specialty;
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    const existingSpecialty = await this.prisma.specialty.findUnique({
      where: { id },
    });

    if (!existingSpecialty) {
      throw new NotFoundException('Spécialité non trouvée');
    }

    // Vérifier l'unicité du nom si il est modifié
    if (updateSpecialtyDto.name && updateSpecialtyDto.name !== existingSpecialty.name) {
      const nameExists = await this.prisma.specialty.findUnique({
        where: { name: updateSpecialtyDto.name },
      });

      if (nameExists) {
        throw new ConflictException('Une spécialité avec ce nom existe déjà');
      }
    }

    return this.prisma.specialty.update({
      where: { id },
      data: updateSpecialtyDto,
    });
  }

  async remove(id: string) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
      include: {
        _count: {
          select: { providers: true },
        },
      },
    });

    if (!specialty) {
      throw new NotFoundException('Spécialité non trouvée');
    }

    if (specialty._count.providers > 0) {
      throw new ConflictException(
        'Impossible de supprimer une spécialité utilisée par des prestataires',
      );
    }

    return this.prisma.specialty.delete({
      where: { id },
    });
  }

  // === PROVIDER SPECIALTIES ===

  async addProviderSpecialty(providerId: string, currentUserId: string, addProviderSpecialtyDto: AddProviderSpecialtyDto) {
    // Vérifier que le prestataire existe et appartient à l'utilisateur connecté
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: providerId }, // Utiliser userId au lieu de id
    });

    if (!provider) {
      throw new NotFoundException('Profil prestataire non trouvé');
    }

    if (provider.userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }

    // Vérifier que la spécialité existe
    const specialty = await this.prisma.specialty.findUnique({
      where: { id: addProviderSpecialtyDto.specialtyId },
    });

    if (!specialty) {
      throw new NotFoundException('Spécialité non trouvée');
    }

    // Vérifier que l'association n'existe pas déjà
    const existingAssociation = await this.prisma.providerSpecialty.findUnique({
      where: {
        providerId_specialtyId: {
          providerId: provider.id, // Utiliser provider.id
          specialtyId: addProviderSpecialtyDto.specialtyId,
        },
      },
    });

    if (existingAssociation) {
      throw new ConflictException('Cette spécialité est déjà associée à ce prestataire');
    }

    return this.prisma.providerSpecialty.create({
      data: {
        providerId: provider.id, // Utiliser provider.id
        specialtyId: addProviderSpecialtyDto.specialtyId,
        level: addProviderSpecialtyDto.level,
        certification: addProviderSpecialtyDto.certification,
      },
      include: {
        specialty: true,
        provider: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async removeProviderSpecialty(providerId: string, specialtyId: string, currentUserId: string) {
    // Vérifier que le prestataire existe et appartient à l'utilisateur connecté
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: providerId }, // Utiliser userId au lieu de id
    });

    if (!provider) {
      throw new NotFoundException('Profil prestataire non trouvé');
    }

    if (provider.userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }

    const association = await this.prisma.providerSpecialty.findUnique({
      where: {
        providerId_specialtyId: {
          providerId: provider.id, // Utiliser provider.id
          specialtyId,
        },
      },
    });

    if (!association) {
      throw new NotFoundException('Association non trouvée');
    }

    return this.prisma.providerSpecialty.delete({
      where: {
        providerId_specialtyId: {
          providerId: provider.id, // Utiliser provider.id
          specialtyId,
        },
      },
    });
  }

  async getProviderSpecialties(providerId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: providerId }, // Chercher par userId au lieu de id
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Profil prestataire non trouvé');
    }

    return provider.specialties;
  }
}
